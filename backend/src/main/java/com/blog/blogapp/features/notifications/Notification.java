package com.blog.blogapp.features.notifications;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(length = 500)
    private String link;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // IMPORTANT: use different column name, because "read" is reserved
    @Column(name = "read_flag", nullable = false)
    private boolean readFlag = false;

    // ---- getters / setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    // This is what JSON / frontend will see as "read"
    public boolean isRead() { return readFlag; }
    public void setRead(boolean read) { this.readFlag = read; }

    // Optional extra getters/setters if JPA wants the exact field name
    public boolean isReadFlag() { return readFlag; }
    public void setReadFlag(boolean readFlag) { this.readFlag = readFlag; }
}
