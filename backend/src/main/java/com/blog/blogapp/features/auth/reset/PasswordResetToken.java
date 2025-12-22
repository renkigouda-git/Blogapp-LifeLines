package com.blog.blogapp.features.auth.reset;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "password_reset")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiresAt;

    public PasswordResetToken() {}

    public PasswordResetToken(Long userId, String token, Instant expiry) {
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiry;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Instant getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(Instant expiresAt) {
		this.expiresAt = expiresAt;
	}

    // getters/setters
}
