package com.blog.blogapp.features.auth.verification;

import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationRepository repo;
    private final UserRepository users;

    public EmailVerificationService(EmailVerificationRepository repo, UserRepository users) {
        this.repo = repo;
        this.users = users;
    }

    public String createToken(User user) {

        // delete old token
        repo.findByUserId(user.getId()).ifPresent(repo::delete);

        String token = UUID.randomUUID().toString();

        EmailVerification ev = new EmailVerification();
        ev.setToken(token);
        ev.setUser(user);
        ev.setExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));

        repo.save(ev);
        return token;
    }

    public boolean verify(String token) {

        Optional<EmailVerification> rec = repo.findByToken(token);
        if (rec.isEmpty()) return false;

        EmailVerification ev = rec.get();

        if (ev.getExpiresAt().isBefore(Instant.now())) {
            repo.delete(ev);
            return false;
        }

        User u = ev.getUser();
        u.setBanned(false);
        users.save(u);

        repo.delete(ev);
        return true;
    }
}
