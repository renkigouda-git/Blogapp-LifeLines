package com.blog.blogapp.features.posts.service;

import com.blog.blogapp.features.posts.entity.Post;
import com.blog.blogapp.features.posts.repository.PostRepository;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

  private final PostRepository posts;
  private final UserRepository users;

  public PostService(PostRepository posts, UserRepository users) {
    this.posts = posts;
    this.users = users;
  }

  public Post create(Post p, Authentication auth) {
    String email = extractEmailOrThrow(auth);

    User u = users.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    p.setAuthor(u.getName());
    p.setAuthorId(u.getId());
    if (p.getCreatedAt() == null) {
      p.setCreatedAt(LocalDateTime.now());
    }
    return posts.save(p);
  }

  /** First 100 newest posts (keeps your current contract) */
  public List<Post> listAll() {
    return posts.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 100)).getContent();
  }

  public Post get(Long id) {
    return posts.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
  }

  public void delete(Long id, Authentication auth) {
    String email = extractEmailOrThrow(auth);

    User user = users.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    Post post = posts.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

    boolean isAdmin = user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().name());
    boolean isAuthor = post.getAuthorId() != null && post.getAuthorId().equals(user.getId());

    if (!isAdmin && !isAuthor) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can delete only your own post");
    }

    posts.delete(post);
  }

  /** helpers */
  private String extractEmailOrThrow(Authentication auth) {
    if (auth == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
    }
    Object principal = auth.getPrincipal();
    if (principal instanceof UserDetails ud) {
      return ud.getUsername(); // email stored as username
    }
    String name = auth.getName();
    if (name == null || name.isBlank()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
    }
    return name;
  }
}
