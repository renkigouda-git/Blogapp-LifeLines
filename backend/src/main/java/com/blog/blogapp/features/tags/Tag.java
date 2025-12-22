package com.blog.blogapp.features.tags;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tags")
public class Tag {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(nullable = false)
  private String name;

  @Column(name = "image_url")
  private String imageUrl;

  @Column(name = "created_at", updatable = false)
  private Instant createdAt = Instant.now();

  public Tag() {}

  public Tag(String name, String slug, String imageUrl) {
    this.name = name;
    this.slug = slug;
    this.imageUrl = imageUrl;
  }

  // getters & setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getSlug() { return slug; }
  public void setSlug(String slug) { this.slug = slug; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
