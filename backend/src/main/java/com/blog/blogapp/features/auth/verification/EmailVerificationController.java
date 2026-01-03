package com.blog.blogapp.features.auth.verification;

import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/verify-otp")
@CrossOrigin(origins = "*")
public class EmailVerificationController {

    private final EmailVerificationService service;
    private final UserRepository users;

    public EmailVerificationController(
            EmailVerificationService service,
            UserRepository users
    ) {
        this.service = service;
        this.users = users;
    }

    /** STEP 1: Send OTP */
    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        users.findByEmail(email).ifPresent(service::sendOtp);

        return ResponseEntity.ok(
                Map.of("message", "If email exists, OTP has been sent")
        );
    }

    /** STEP 2: Confirm OTP */
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        boolean ok = service.verifyOtp(email, otp);

        return ok
                ? ResponseEntity.ok(Map.of("status", "email-verified"))
                : ResponseEntity.badRequest().body(Map.of("error", "invalid-or-expired-otp"));
    }
}
