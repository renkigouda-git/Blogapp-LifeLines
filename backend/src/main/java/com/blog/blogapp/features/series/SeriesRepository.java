package com.blog.blogapp.features.series;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeriesRepository extends JpaRepository<Series, Long> {
  Optional<Series> findBySlug(String slug);
  boolean existsBySlug(String slug);
}
