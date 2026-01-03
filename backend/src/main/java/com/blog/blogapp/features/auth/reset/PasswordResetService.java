package com.blog.blogapp.features.auth.reset;

import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.blog.blogapp.common.mail.EmailSenderService;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

@Service
public class PasswordResetService {

    private final PasswordResetRepository repo;
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final EmailSenderService emailSender;

    public PasswordResetService(
            PasswordResetRepository repo,
            UserRepository users,
            PasswordEncoder encoder,EmailSenderService emailSender) {
        this.repo = repo;
        this.users = users;
        this.encoder = encoder;
        this.emailSender = emailSender;
    }

    /** STEP A: Send OTP */
    @Transactional
    public void sendOtp(User user) {
        // delete old OTP if exists
        repo.deleteByUserId(user.getId());

        String otp = generateOtp();

        PasswordResetToken pr = new PasswordResetToken(
                user.getId(),
                otp,
                Instant.now().plus(10, ChronoUnit.MINUTES)
        );

        repo.save(pr);

        // TEMP: print OTP (will be replaced by email sender)
        emailSender.sendOtp(user.getEmail(), "Password Reset", otp);

    }

    /** STEP B: Verify OTP */
    public boolean verifyOtp(String email, String otp) {
        Optional<User> uOpt = users.findByEmail(email);
        if (uOpt.isEmpty()) return false;

        Optional<PasswordResetToken> tOpt = repo.findByToken(otp);
        if (tOpt.isEmpty()) return false;

        PasswordResetToken pr = tOpt.get();
        if (!pr.getUserId().equals(uOpt.get().getId())) return false;

        if (pr.getExpiresAt().isBefore(Instant.now())) {
            repo.delete(pr);
            return false;
        }

        return true;
    }

    /** STEP C: Reset password (after OTP verified) */
    @Transactional
    public boolean resetPassword(String email, String newPassword) {
        Optional<User> uOpt = users.findByEmail(email);
        if (uOpt.isEmpty()) return false;

        User u = uOpt.get();
        u.setPassword(encoder.encode(newPassword));
        users.save(u);

        // cleanup OTP
        repo.deleteByUserId(u.getId());
        return true;
    }

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
