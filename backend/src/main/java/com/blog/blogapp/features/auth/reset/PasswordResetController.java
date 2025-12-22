package com.blog.blogapp.features.auth.reset;

import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    private final PasswordResetService service;
    private final UserRepository users;

    public PasswordResetController(PasswordResetService service, UserRepository users) {
        this.service = service;
        this.users = users;
    }

    @PostMapping("/forgot")
    public ResponseEntity<?> forgot(@RequestBody User req) {
        User u = users.findByEmail(req.getEmail()).orElse(null);

        String message = "If email exists, reset link was sent.";

        if (u != null) {
            String token = service.createResetToken(u);
            String link = "http://localhost:5173/reset/" + token;

            // Print link for debugging
            System.out.println("RESET LINK: " + link);

            return ResponseEntity.ok(Map.of(
                    "message", message,
                    "resetLink", link
            ));
        }

        return ResponseEntity.ok(Map.of(
                "message", message
        ));
    }

    @PostMapping("/reset/{token}")
    public ResponseEntity<?> reset(@PathVariable String token, @RequestBody Map<String,String> body) {
        boolean ok = service.resetPassword(token, body.get("password"));

        return ok
                ? ResponseEntity.ok("Password updated")
                : ResponseEntity.badRequest().body("Invalid or expired reset token");
    }
}
