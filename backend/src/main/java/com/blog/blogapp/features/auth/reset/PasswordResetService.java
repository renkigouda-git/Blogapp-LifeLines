package com.blog.blogapp.features.auth.reset;

import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final PasswordResetRepository repo;
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public PasswordResetService(
            PasswordResetRepository repo,
            UserRepository users,
            PasswordEncoder encoder) {
        this.repo = repo;
        this.users = users;
        this.encoder = encoder;
    }

    public String createResetToken(User user) {
        String token = UUID.randomUUID().toString();
        repo.deleteByUserId(user.getId());

        PasswordResetToken pr = new PasswordResetToken(
                user.getId(),
                token,
                Instant.now().plusSeconds(3600)
        );

        repo.save(pr);
        return token;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> opt = repo.findByToken(token);
        if (opt.isEmpty()) return false;

        PasswordResetToken pr = opt.get();
        if (pr.getExpiresAt().isBefore(Instant.now())) return false;

        User u = users.findById(pr.getUserId()).orElseThrow();
        u.setPassword(encoder.encode(newPassword));
        users.save(u);
        repo.delete(pr);
        return true;
    }
}
