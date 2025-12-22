package com.blog.blogapp.features.notifications;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class NotificationController {

    private final NotificationRepository repo;

    public NotificationController(NotificationRepository repo) {
        this.repo = repo;
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    // List all (with read flag)
    @GetMapping
    public ResponseEntity<List<NotificationDto>> list() {
        List<NotificationDto> body = repo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(body);
    }

    // unread count for bell
    @GetMapping("/unread-count")
    public ResponseEntity<Long> unreadCount() {
        long count = repo.countUnread();
        return ResponseEntity.ok(count);
    }

    // Admin creates notification
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateNotificationRequest req) {
        if (!isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only admin can send notifications");
        }

        if (req.getMessage() == null || req.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message is required");
        }

        Notification n = new Notification();
        n.setTitle(
                (req.getTitle() == null || req.getTitle().trim().isEmpty())
                        ? "Announcement"
                        : req.getTitle().trim()
        );
        n.setMessage(req.getMessage().trim());
        n.setLink(req.getLink());
        n.setCreatedAt(Instant.now());
        n.setRead(false); // new ones unread

        Notification saved = repo.save(n);
        return ResponseEntity.ok(NotificationDto.fromEntity(saved));
    }

    // Admin delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Mark single as read
    @PostMapping("/{id}/read")
    @Transactional
    public ResponseEntity<Void> markOneRead(@PathVariable Long id) {
        int updated = repo.markOneRead(id);
        if (updated == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // Mark ALL as read
    @PostMapping("/mark-all-read")
    @Transactional
    public ResponseEntity<Void> markAllRead() {
        repo.markAllRead();
        return ResponseEntity.noContent().build();
    }
}
