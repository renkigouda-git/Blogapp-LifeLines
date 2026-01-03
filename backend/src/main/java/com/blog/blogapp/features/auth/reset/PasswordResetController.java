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

    /** STEP 1: Request OTP */
    @PostMapping("/forgot")
    public ResponseEntity<?> forgot(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        users.findByEmail(email).ifPresent(service::sendOtp);

        // generic response (official behavior)
        return ResponseEntity.ok(
                Map.of("message", "If email exists, OTP has been sent")
        );
    }

    /** STEP 2: Verify OTP */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        boolean ok = service.verifyOtp(email, otp);
        return ok
                ? ResponseEntity.ok(Map.of("status", "otp-verified"))
                : ResponseEntity.badRequest().body(Map.of("error", "invalid-or-expired-otp"));
    }

    /** STEP 3: Reset Password */
    @PostMapping("/reset")
    public ResponseEntity<?> reset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        boolean ok = service.resetPassword(email, password);
        return ok
                ? ResponseEntity.ok(Map.of("status", "password-updated"))
                : ResponseEntity.badRequest().body(Map.of("error", "reset-failed"));
    }
}
