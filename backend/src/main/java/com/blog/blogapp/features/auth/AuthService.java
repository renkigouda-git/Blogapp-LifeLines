package com.blog.blogapp.features.auth;

import com.blog.blogapp.features.auth.verification.EmailVerificationService;
import com.blog.blogapp.features.users.entity.Role;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import com.blog.blogapp.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final EmailVerificationService emailVerificationService;

    public AuthService(
            UserRepository users,
            PasswordEncoder encoder,
            JwtUtil jwt,
            EmailVerificationService emailVerificationService
    ) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.emailVerificationService = emailVerificationService;
    }

    public Map<String, Object> register(String name, String email, String password) {

        if (users.findByEmail(email).isPresent())
            throw new RuntimeException("Email exists");

        User u = new User(name, email, encoder.encode(password), Role.USER);

        u.setBanned(true); // require verification
        users.save(u);

        String token = emailVerificationService.createToken(u);
        String verifyUrl = "http://localhost:5173/verify/" + token;

        System.out.println("VERIFY LINK: " + verifyUrl);

        return Map.of(
            "message", "Account created",
            "verifyUrl", verifyUrl
        );
    }

    public Map<String,Object> login(String email, String password){
        User u = users.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(password, u.getPassword()))
            throw new RuntimeException("Invalid credentials");

        if (u.isBanned())
            throw new IllegalStateException("VERIFY_EMAIL");

        String token = jwt.generateToken(email, u.getRole().name());

        return Map.of(
                "token", token,
                "user", Map.of(
                        "name", u.getName(),
                        "email", u.getEmail(),
                        "role", u.getRole().name()
                )
        );
    }
}
