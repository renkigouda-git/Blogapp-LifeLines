package com.blog.blogapp.features.posts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  @Column(columnDefinition = "TEXT")
  private String content;

  private String coverImageUrl;

  private Long authorId;

  private String author;

  private LocalDateTime createdAt;

  public Post() {}

  @PrePersist
  public void prePersist() {
    if (this.createdAt == null) {
      this.createdAt = LocalDateTime.now();
    }
  }

  // getters / setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }

  public String getCoverImageUrl() { return coverImageUrl; }
  public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

  public Long getAuthorId() { return authorId; }
  public void setAuthorId(Long authorId) { this.authorId = authorId; }

  public String getAuthor() { return author; }
  public void setAuthor(String author) { this.author = author; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

