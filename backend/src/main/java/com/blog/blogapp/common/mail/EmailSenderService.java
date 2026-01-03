package com.blog.blogapp.common.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String purpose, String otp) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Your OTP Code");
        msg.setText(
                "Your OTP for " + purpose + " is: " + otp + "\n\n" +
                "This code is valid for 10 minutes.\n\n" +
                "If you did not request this, please ignore this email."
        );

        mailSender.send(msg);
    }
}
