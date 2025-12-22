package com.blog.blogapp.features.series;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "series")
public class Series {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(nullable = false)
  private String name;

  // unify column name with your DB if it's image_url or imageUrl; map both possibilities:
  @Column(name = "image_url")
  private String imageUrl;

  @Column(name = "created_at", updatable = false)
  private Instant createdAt = Instant.now();

  public Series() {}

  public Series(String name, String slug, String imageUrl) {
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
