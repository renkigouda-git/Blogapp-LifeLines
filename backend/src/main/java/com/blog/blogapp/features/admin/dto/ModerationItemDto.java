package com.blog.blogapp.features.admin.dto;

import java.time.LocalDateTime;

public class ModerationItemDto {

    private Long id;
    private String type;      // "POST" or "COMMENT"
    private String title;
    private String content;
    private String reporter;
    private String status;    // "PENDING", "APPROVED", "REJECTED", "DELETED"
    private LocalDateTime createdAt;

    public ModerationItemDto() {}

    public ModerationItemDto(Long id, String type, String title, String content,
                             String reporter, String status, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.content = content;
        this.reporter = reporter;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getReporter() { return reporter; }
    public void setReporter(String reporter) { this.reporter = reporter; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
