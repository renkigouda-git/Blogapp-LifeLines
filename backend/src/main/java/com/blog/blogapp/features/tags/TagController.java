package com.blog.blogapp.features.tags;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.jdbc.core.JdbcTemplate;

import java.net.URI;
import java.sql.ResultSet;
import java.util.*;

@RestController
@RequestMapping("/api")
public class TagController {

  private final TagRepository tagRepository;
  private final JdbcTemplate jdbc;

  public TagController(TagRepository tagRepository, JdbcTemplate jdbc) {
    this.tagRepository = tagRepository;
    this.jdbc = jdbc;
  }

  @GetMapping("/tags")
  public ResponseEntity<List<Tag>> list() {
    return ResponseEntity.ok(tagRepository.findAll());
  }

  /**
   * GET /api/tags/{slug}
   * Returns JSON: { tag: {id,name,slug,imageUrl,...}, posts: [ {id,title,content,coverImageUrl,createdAt,author}, ... ] }
   */
  @GetMapping("/tags/{slug}")
  public ResponseEntity<Map<String,Object>> getBySlug(@PathVariable String slug) {
    return tagRepository.findBySlug(slug).map(t -> {
      Map<String,Object> out = new HashMap<>();

      Map<String,Object> tMap = new HashMap<>();
      tMap.put("id", t.getId());
      tMap.put("name", t.getName());
      tMap.put("slug", t.getSlug());
      tMap.put("imageUrl", t.getImageUrl());
      out.put("tag", tMap);

      // Query posts for this tag (ordered newest first)
      List<Map<String,Object>> posts = jdbc.query(
        "SELECT p.id, p.title, p.content, p.cover_image_url, p.created_at, p.author " +
        "FROM posts p " +
        "JOIN post_tags pt ON pt.post_id = p.id " +
        "WHERE pt.tag_id = ? " +
        "ORDER BY p.created_at DESC",
        new Object[]{ t.getId() },
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

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/admin/tags")
  public ResponseEntity<Tag> create(@RequestBody Tag incoming) {
    if (incoming.getSlug() == null || incoming.getName() == null) {
      return ResponseEntity.badRequest().build();
    }
    if (tagRepository.existsBySlug(incoming.getSlug())) {
      return ResponseEntity.status(409).build();
    }
    Tag saved = tagRepository.save(incoming);
    return ResponseEntity.created(URI.create("/api/tags/" + saved.getSlug())).body(saved);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/api/admin/tags/{id}")
  public ResponseEntity<Tag> update(@PathVariable Long id, @RequestBody Tag incoming) {
    return tagRepository.findById(id).map(t -> {
      if (incoming.getName() != null) t.setName(incoming.getName());
      if (incoming.getSlug() != null) t.setSlug(incoming.getSlug());
      if (incoming.getImageUrl() != null) t.setImageUrl(incoming.getImageUrl());
      Tag saved = tagRepository.save(t);
      return ResponseEntity.ok(saved);
    }).orElse(ResponseEntity.notFound().build());
  }
}
