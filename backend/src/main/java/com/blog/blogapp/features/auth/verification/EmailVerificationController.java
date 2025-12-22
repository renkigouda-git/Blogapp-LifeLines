package com.blog.blogapp.features.auth.verification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/verify")
@CrossOrigin(origins = "*")
public class EmailVerificationController {

    private final EmailVerificationRepository repo;
    private final EmailVerificationService service;

    public EmailVerificationController(EmailVerificationRepository repo, EmailVerificationService service) {
        this.repo = repo;
        this.service = service;
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> verify(@PathVariable String token) {

        Optional<EmailVerification> rec = repo.findByToken(token);
        if (rec.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "not-found"));
        }

        EmailVerification ev = rec.get();

        if (ev.getExpiresAt().isBefore(Instant.now())) {
            repo.delete(ev);
            return ResponseEntity.status(410).body(Map.of("error", "expired"));
        }

        boolean ok = service.verify(token);
        if (ok) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        }

        return ResponseEntity.status(400).body(Map.of("error", "invalid-token"));
    }
}
