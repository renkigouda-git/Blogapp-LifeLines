package com.blog.blogapp.features.auth.verification;

import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.blog.blogapp.common.mail.EmailSenderService;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailVerificationService {

    private final EmailVerificationRepository repo;
    private final UserRepository users;
    private final EmailSenderService emailSender;

    public EmailVerificationService(EmailVerificationRepository repo, UserRepository users,EmailSenderService emailSender) {
        this.repo = repo;
        this.users = users;
         this.emailSender = emailSender;
    }

    /** STEP A: Send OTP */
    @Transactional
    public void sendOtp(User user) {

        // remove old OTP if exists
        repo.findByUserId(user.getId()).ifPresent(repo::delete);

        String otp = generateOtp();

        EmailVerification ev = new EmailVerification();
        ev.setUser(user);
        ev.setToken(otp);
        ev.setExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));

        repo.save(ev);

        // TEMP: print OTP (will be replaced by email sender)
        emailSender.sendOtp(user.getEmail(), "Email Verification", otp);

    }

    /** STEP B: Verify OTP */
    @Transactional
    public boolean verifyOtp(String email, String otp) {

        Optional<User> uOpt = users.findByEmail(email);
        if (uOpt.isEmpty()) return false;

        Optional<EmailVerification> evOpt = repo.findByToken(otp);
        if (evOpt.isEmpty()) return false;

        EmailVerification ev = evOpt.get();

        if (!ev.getUser().getId().equals(uOpt.get().getId())) return false;

        if (ev.getExpiresAt().isBefore(Instant.now())) {
            repo.delete(ev);
            return false;
        }

        // mark user as verified
        User u = ev.getUser();
        u.setBanned(false);
        users.save(u);

        repo.delete(ev);
        return true;
    }

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
