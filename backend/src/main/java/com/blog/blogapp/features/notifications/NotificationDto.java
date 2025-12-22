package com.blog.blogapp.features.notifications;

import java.time.Instant;

public class NotificationDto {

    private Long id;
    private String title;
    private String message;
    private String link;
    private Instant createdAt;
    private boolean read;   // <── IMPORTANT

    // getters / setters

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

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    // mapper
    public static NotificationDto fromEntity(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setLink(n.getLink());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setRead(n.isRead());       // <── send "read" to frontend
        return dto;
    }
}
