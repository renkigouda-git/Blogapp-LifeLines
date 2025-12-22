package com.blog.blogapp.features.series;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.jdbc.core.JdbcTemplate;

import java.net.URI;
import java.sql.ResultSet;
import java.util.*;

@RestController
@RequestMapping("/api")
public class SeriesController {

  private final SeriesRepository seriesRepository;
  private final JdbcTemplate jdbc;

  public SeriesController(SeriesRepository seriesRepository, JdbcTemplate jdbc) {
    this.seriesRepository = seriesRepository;
    this.jdbc = jdbc;
  }

  // Public: list all
  @GetMapping("/series")
  public ResponseEntity<List<Series>> list() {
    return ResponseEntity.ok(seriesRepository.findAll());
  }

  /**
   * Public: get by slug
   * Returns JSON: { series: {id,name,slug,imageUrl,...}, posts: [ {id,title,content,coverImageUrl,createdAt,author}, ... ] }
   */
  @GetMapping("/series/{slug}")
  public ResponseEntity<Map<String,Object>> getBySlug(@PathVariable String slug) {
    return seriesRepository.findBySlug(slug).map(s -> {
      Map<String,Object> out = new HashMap<>();

      Map<String,Object> sMap = new HashMap<>();
      sMap.put("id", s.getId());
      sMap.put("name", s.getName());
      sMap.put("slug", s.getSlug());
      sMap.put("imageUrl", s.getImageUrl());
      out.put("series", sMap);

      // Query posts for this series (ordered newest first)
      List<Map<String,Object>> posts = jdbc.query(
        "SELECT p.id, p.title, p.content, p.cover_image_url, p.created_at, p.author " +
        "FROM posts p " +
        "JOIN post_series ps ON ps.post_id = p.id " +
        "WHERE ps.series_id = ? " +
        "ORDER BY p.created_at DESC",
        new Object[]{ s.getId() },
        (ResultSet rs) -> {
          List<Map<String,Object>> list = new ArrayList<>();
          while (rs.next()) {
            Map<String,Object> m = new HashMap<>();
            m.put("id", rs.getLong("id"));
            m.put("title", rs.getString("title"));
            m.put("content", rs.getString("content"));
            m.put("coverImageUrl", rs.getString("cover_image_url"));
            if (rs.getTimestamp("created_at") != null) {
              m.put("createdAt", rs.getTimestamp("created_at").toInstant().toString());
            } else {
              m.put("createdAt", null);
            }
            m.put("author", rs.getString("author"));
            list.add(m);
          }
          return list;
        });

      out.put("posts", posts == null ? Collections.emptyList() : posts);
      return ResponseEntity.ok(out);
    }).orElse(ResponseEntity.notFound().build());
  }

  // Admin: create
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/admin/series")
  public ResponseEntity<Series> create(@RequestBody Series incoming) {
    if (incoming.getSlug() == null || incoming.getName() == null) {
      return ResponseEntity.badRequest().build();
    }
    if (seriesRepository.existsBySlug(incoming.getSlug())) {
      return ResponseEntity.status(409).build();
    }
    Series saved = seriesRepository.save(incoming);
    return ResponseEntity.created(URI.create("/api/series/" + saved.getSlug())).body(saved);
  }

  // Admin: update
  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/api/admin/series/{id}")
  public ResponseEntity<Series> update(@PathVariable Long id, @RequestBody Series incoming) {
    return seriesRepository.findById(id).map(s -> {
      if (incoming.getName() != null) s.setName(incoming.getName());
      if (incoming.getSlug() != null) s.setSlug(incoming.getSlug());
      if (incoming.getImageUrl() != null) s.setImageUrl(incoming.getImageUrl());
      Series saved = seriesRepository.save(s);
      return ResponseEntity.ok(saved);
    }).orElse(ResponseEntity.notFound().build());
  }
}
