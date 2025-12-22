package com.blog.blogapp.features.comments.service;

import com.blog.blogapp.common.exception.NotFoundException;
import com.blog.blogapp.features.comments.dto.CommentRequest;
import com.blog.blogapp.features.comments.dto.CommentResponse;
import com.blog.blogapp.features.comments.entity.Comment;
import com.blog.blogapp.features.comments.repository.CommentRepository;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

  private final CommentRepository comments;
  private final UserRepository users;

  public CommentService(CommentRepository comments, UserRepository users) {
    this.comments = comments;
    this.users = users;
  }

  public List<CommentResponse> list(Long postId, int page, int size) {
    return comments
        .findByPostIdOrderByCreatedAtAsc(postId, PageRequest.of(page, size))
        .getContent()
        .stream()
        .map(this::map)
        .toList();
  }

  public CommentResponse create(Long postId, CommentRequest req, Authentication auth) {
    if (auth == null) throw new RuntimeException("Unauthorized");
    String email = extractEmail(auth);

    User user = users.findByEmail(email)
        .orElseThrow(() -> new NotFoundException("User not found: " + email));

    Comment c = new Comment();
    c.setPostId(postId);
    c.setText(req.text());
    c.setAuthorId(user.getId());
    c.setAuthor(user.getName());
    c.setAuthorEmail(user.getEmail());
    c.setCreatedAt(LocalDateTime.now());
    return map(comments.save(c));
  }

  public void delete(Long id, Authentication auth) {
    Comment c = comments.findById(id).orElseThrow(() -> new NotFoundException("Comment not found"));
    if (auth == null) throw new RuntimeException("Unauthorized");
    String email = extractEmail(auth);

    User me = users.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found: " + email));
    boolean isAdmin = "ADMIN".equalsIgnoreCase(me.getRole().name());
    boolean isAuthor = c.getAuthorId() != null && c.getAuthorId().equals(me.getId());

    if (!isAdmin && !isAuthor) throw new RuntimeException("Forbidden");
    comments.delete(c);
  }

  // helpers
  private String extractEmail(Authentication auth) {
    Object p = auth.getPrincipal();
    if (p instanceof UserDetails ud) return ud.getUsername();
    return auth.getName();
  }

  private CommentResponse map(Comment c) {
    return new CommentResponse(
        c.getId(), c.getPostId(), c.getText(), c.getAuthor(), c.getAuthorEmail(), c.getCreatedAt()
    );
  }
}
