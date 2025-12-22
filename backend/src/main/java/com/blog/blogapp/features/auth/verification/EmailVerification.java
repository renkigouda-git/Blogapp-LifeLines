package com.blog.blogapp.features.auth.verification;

import com.blog.blogapp.features.users.entity.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "email_verification")
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public Long getId() { return id; }
    public String getToken() { return token; }
    public Instant getExpiresAt() { return expiresAt; }
    public User getUser() { return user; }

    public void setToken(String token) { this.token = token; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public void setUser(User user) { this.user = user; }
}
