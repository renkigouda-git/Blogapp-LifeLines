package com.blog.blogapp.features.comments.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(columnDefinition = "TEXT")
  private String text;

  private Long postId;

  private Long authorId;
  private String author;       // display name
  private String authorEmail;  // used for client-side checks
  private LocalDateTime createdAt;

  public Comment() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getText() { return text; }
  public void setText(String text) { this.text = text; }

  public Long getPostId() { return postId; }
  public void setPostId(Long postId) { this.postId = postId; }

  public Long getAuthorId() { return authorId; }
  public void setAuthorId(Long authorId) { this.authorId = authorId; }

  public String getAuthor() { return author; }
  public void setAuthor(String author) { this.author = author; }

  public String getAuthorEmail() { return authorEmail; }
  public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
