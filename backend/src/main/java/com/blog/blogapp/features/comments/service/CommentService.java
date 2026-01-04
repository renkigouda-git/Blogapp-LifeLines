package com.blog.blogapp.features.comments.service;

import com.blog.blogapp.common.exception.NotFoundException;
import com.blog.blogapp.features.comments.dto.CommentRequest;
import com.blog.blogapp.features.comments.dto.CommentResponse;
import com.blog.blogapp.features.comments.entity.Comment;
import com.blog.blogapp.features.comments.repository.CommentRepository;
import com.blog.blogapp.features.posts.entity.Post;
import com.blog.blogapp.features.posts.repository.PostRepository;
import com.blog.blogapp.features.settings.entity.UserSettings;
import com.blog.blogapp.features.settings.repository.UserSettingsRepository;
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
    private final PostRepository posts;
    private final UserSettingsRepository settingsRepo;

    public CommentService(
            CommentRepository comments,
            UserRepository users,
            PostRepository posts,
            UserSettingsRepository settingsRepo
    ) {
        this.comments = comments;
        this.users = users;
        this.posts = posts;
        this.settingsRepo = settingsRepo;
    }

    // -------------------------
    // LIST COMMENTS (unchanged)
    // -------------------------
    public List<CommentResponse> list(Long postId, int page, int size) {
        return comments
                .findByPostIdOrderByCreatedAtAsc(postId, PageRequest.of(page, size))
                .getContent()
                .stream()
                .map(this::map)
                .toList();
    }

    // -------------------------
    // CREATE COMMENT (privacy enforced)
    // -------------------------
    public CommentResponse create(Long postId, CommentRequest req, Authentication auth) {
        if (auth == null) throw new RuntimeException("Unauthorized");

        String email = extractEmail(auth);

        // logged-in user
        User user = users.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found: " + email));

        // load post
        Post post = posts.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found: " + postId));

        // load post owner
        User postOwner = users.findById(post.getAuthorId())
                .orElseThrow(() -> new NotFoundException("Post owner not found"));

        // load owner settings (may be null for very old users)
        UserSettings settings = settingsRepo
                .findByUserId(postOwner.getId())
                .orElse(null);

        // admin override
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole().name());

        // ---- PRIVACY CHECK ----
        if (!isAdmin && settings != null) {

            // profile private → block comments
            if ("private".equalsIgnoreCase(settings.getProfileVisibility())) {
                throw new RuntimeException("Comments are disabled for this profile");
            }

            // comments disabled
            if ("none".equalsIgnoreCase(settings.getCommentPermission())) {
                throw new RuntimeException("Comments are disabled");
            }
        }
        // ---- END PRIVACY CHECK ----

        // create comment (unchanged logic)
        Comment c = new Comment();
        c.setPostId(postId);
        c.setText(req.text());
        c.setAuthorId(user.getId());
        c.setAuthor(user.getName());
        c.setAuthorEmail(user.getEmail());
        c.setCreatedAt(LocalDateTime.now());

        return map(comments.save(c));
    }

    // -------------------------
    // DELETE COMMENT (unchanged)
    // -------------------------
    public void delete(Long id, Authentication auth) {
        Comment c = comments.findById(id)
                .orElseThrow(() -> new NotFoundException("Comment not found"));

        if (auth == null) throw new RuntimeException("Unauthorized");

        String email = extractEmail(auth);

        User me = users.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found: " + email));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(me.getRole().name());
        boolean isAuthor = c.getAuthorId() != null && c.getAuthorId().equals(me.getId());

        if (!isAdmin && !isAuthor) {
            throw new RuntimeException("Forbidden");
        }

        comments.delete(c);
    }

    // -------------------------
    // HELPERS (unchanged)
    // -------------------------
    private String extractEmail(Authentication auth) {
        Object p = auth.getPrincipal();
        if (p instanceof UserDetails ud) return ud.getUsername();
        return auth.getName();
    }

    private CommentResponse map(Comment c) {
        return new CommentResponse(
                c.getId(),
                c.getPostId(),
                c.getText(),
                c.getAuthor(),
                c.getAuthorEmail(),
                c.getCreatedAt()
        );
    }
}
