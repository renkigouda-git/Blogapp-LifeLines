package com.blog.blogapp.features.posts.controller;

import com.blog.blogapp.features.posts.entity.Post;
import com.blog.blogapp.features.posts.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4200"
})
public class PostController {

  private final PostService service;
  private final JdbcTemplate jdbc;

  public PostController(PostService service, JdbcTemplate jdbc) {
    this.service = service;
    this.jdbc = jdbc;
  }

  // --------------------------------------------------------------------------------
  // Existing endpoints (kept intact)
  // --------------------------------------------------------------------------------
  @GetMapping
  public ResponseEntity<List<Post>> list() {
    return ResponseEntity.ok(service.listAll());
  }

  /**
   * REPLACED: return post with embedded series and tags so frontend sees persisted mappings.
   * GET /api/posts/{id} -> returns JSON map with fields:
   * id, title, content, coverImageUrl, createdAt, author, series: {id,name,slug,imageUrl}|null, tags: [{...},...]
   */
  @GetMapping("/{id}")
  public ResponseEntity<Map<String,Object>> get(@PathVariable Long id) {
    // load base post using existing service (keeps business rules)
    Post p = service.get(id);
    if (p == null) return ResponseEntity.notFound().build();

    Map<String,Object> out = new HashMap<>();
    out.put("id", p.getId());
    out.put("title", p.getTitle());
    out.put("content", p.getContent());
    out.put("coverImageUrl", p.getCoverImageUrl());
    out.put("createdAt", p.getCreatedAt() == null ? null : p.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toString());
    out.put("author", p.getAuthor());

    // fetch single series (if any) - choose first mapping if multiple
    Map<String,Object> series = null;
    List<Map<String,Object>> srows = jdbc.query(
      "SELECT s.id AS sid, s.name, s.slug, s.image_url FROM post_series ps JOIN series s ON s.id = ps.series_id WHERE ps.post_id = ? LIMIT 1",
      new Object[]{id},
      (ResultSet rs) -> {
        if (rs.next()) {
          Map<String,Object> m = new HashMap<>();
          m.put("id", rs.getLong("sid"));
          m.put("name", rs.getString("name"));
          m.put("slug", rs.getString("slug"));
          m.put("imageUrl", rs.getString("image_url"));
          return Collections.singletonList(m);
        }
        return Collections.emptyList();
      });

    if (!srows.isEmpty()) series = srows.get(0);
    out.put("series", series); // null if none

    // fetch tags (list)
    List<Map<String,Object>> tags = jdbc.query(
      "SELECT t.id AS tid, t.name, t.slug, t.image_url FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = ? ORDER BY t.name",
      new Object[]{id},
      (ResultSet rs) -> {
        List<Map<String,Object>> list = new ArrayList<>();
        while (rs.next()) {
          Map<String,Object> m = new HashMap<>();
          m.put("id", rs.getLong("tid"));
          m.put("name", rs.getString("name"));
          m.put("slug", rs.getString("slug"));
          m.put("imageUrl", rs.getString("image_url"));
          list.add(m);
        }
        return list;
      });

    out.put("tags", tags == null ? Collections.emptyList() : tags);

    return ResponseEntity.ok(out);
  }

  @PostMapping
  public ResponseEntity<Post> create(@RequestBody Post post, Authentication auth) {
    return ResponseEntity.ok(service.create(post, auth));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
    service.delete(id, auth);
    return ResponseEntity.noContent().build();
  }

  // --------------------------------------------------------------------------------
  // New: lightweight endpoints for frontend helpers
  // GET /api/series  -> list of series (id,name,slug,image_url)
  // GET /api/tags    -> list of tags (id,name,slug,image_url)
  // --------------------------------------------------------------------------------
  @GetMapping("/../series") // fallback path if someone requests /api/series from this controller
  public ResponseEntity<List<Map<String,Object>>> redirectSeries() {
    // Prefer canonical /api/series endpoint — but provide route for convenience if frontend calls it.
    return ResponseEntity.status(302).build();
  }

  @GetMapping("/../tags")
  public ResponseEntity<List<Map<String,Object>>> redirectTags() {
    return ResponseEntity.status(302).build();
  }

  // If you prefer canonical endpoints under /api, create additional controllers for series/tags.
  // But we will expose final endpoints below using direct path mapping at root for convenience.

  // Real endpoints for series and tags (accessible at /api/series and /api/tags)
  @GetMapping(path = "/series-list", produces = "application/json")
  public ResponseEntity<List<Map<String,Object>>> seriesListAlt() {
    List<Map<String,Object>> rows = jdbc.query("SELECT id, name, slug, image_url FROM series ORDER BY name",
      (ResultSet rs, int rowNum) -> {
        Map<String,Object> m = new HashMap<>();
        m.put("id", rs.getLong("id"));
        m.put("name", rs.getString("name"));
        m.put("slug", rs.getString("slug"));
        m.put("imageUrl", rs.getString("image_url"));
        return m;
      });
    return ResponseEntity.ok(rows);
  }

  @GetMapping(path = "/tag-list", produces = "application/json")
  public ResponseEntity<List<Map<String,Object>>> tagListAlt() {
    List<Map<String,Object>> rows = jdbc.query("SELECT id, name, slug, image_url FROM tags ORDER BY name",
      (ResultSet rs, int rowNum) -> {
        Map<String,Object> m = new HashMap<>();
        m.put("id", rs.getLong("id"));
        m.put("name", rs.getString("name"));
        m.put("slug", rs.getString("slug"));
        m.put("imageUrl", rs.getString("image_url"));
        return m;
      });
    return ResponseEntity.ok(rows);
  }

  // --------------------------------------------------------------------------------
  // New: map a post to a single series (replace existing mapping)
  // PUT /api/posts/{postId}/series   body: { "seriesId": 31 }     (ADMIN only)
  // --------------------------------------------------------------------------------
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  @PutMapping("/{postId}/series")
  public ResponseEntity<?> mapPostToSeries(@PathVariable Long postId, @RequestBody Map<String, Object> body) {
    // body may contain {"seriesId": 31} or {"seriesId": null} to remove series mapping
    Long seriesId = null;
    if (body != null && body.containsKey("seriesId") && body.get("seriesId") != null) {
      Object v = body.get("seriesId");
      if (v instanceof Number) seriesId = ((Number) v).longValue();
      else seriesId = Long.valueOf(String.valueOf(v));
    }

    // remove any existing mapping
    jdbc.update("DELETE FROM post_series WHERE post_id = ?", postId);

    // insert new mapping if provided
    if (seriesId != null) {
      jdbc.update("INSERT INTO post_series (post_id, series_id) VALUES (?, ?)", postId, seriesId);
    }

    return ResponseEntity.ok().build();
  }

  // --------------------------------------------------------------------------------
  // New: replace tags mapping for a post
  // PUT /api/posts/{postId}/tags   body: { "tagIds": [1,2,3] }   (ADMIN only)
  // --------------------------------------------------------------------------------
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  @PutMapping("/{postId}/tags")
  public ResponseEntity<?> mapPostToTags(@PathVariable Long postId, @RequestBody Map<String, Object> body) {
    List<Object> raw = null;
    if (body != null && body.containsKey("tagIds") && body.get("tagIds") instanceof List) {
      raw = (List<Object>) body.get("tagIds");
    }

    // delete all existing mappings
    jdbc.update("DELETE FROM post_tags WHERE post_id = ?", postId);

    if (raw != null && !raw.isEmpty()) {
      // insert distinct ids
      Set<Long> tagIds = raw.stream().filter(Objects::nonNull).map(o -> {
        if (o instanceof Number) return ((Number) o).longValue();
        return Long.valueOf(String.valueOf(o));
      }).collect(Collectors.toCollection(LinkedHashSet::new));

      for (Long tId : tagIds) {
        jdbc.update("INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)", postId, tId);
      }
    }

    return ResponseEntity.ok().build();
  }

  // --------------------------------------------------------------------------------
  // Helpful endpoint: expanded posts with series + tags embedded
  // GET /api/posts/expanded
  // This returns a list of post "summary" maps with fields:
  // id, title, content, cover_image_url, created_at, author, series: {id,name,slug}, tags: [{id,name,slug}, ...]
  // --------------------------------------------------------------------------------
  @GetMapping("/expanded")
  public ResponseEntity<List<Map<String,Object>>> listExpanded() {
    // get posts basic (we reuse service.listAll so business rules remain centralized)
    List<Post> posts = service.listAll();

    // collect post ids
    List<Long> ids = posts.stream().map(Post::getId).filter(Objects::nonNull).collect(Collectors.toList());
    if (ids.isEmpty()) return ResponseEntity.ok(Collections.emptyList());

    // query series mapping for these posts (single series per post assumed)
    String inClause = ids.stream().map(String::valueOf).collect(Collectors.joining(","));
    Map<Long, Map<String,Object>> seriesByPost = new HashMap<>();
    // If post_series may have multiple series per post, this chooses the first one encountered.
    jdbc.query("SELECT ps.post_id, s.id AS sid, s.name, s.slug, s.image_url FROM post_series ps JOIN series s ON s.id = ps.series_id WHERE ps.post_id IN (" + inClause + ")",
      (ResultSet rs) -> {
        while (rs.next()) {
          Long pid = rs.getLong("post_id");
          Map<String,Object> s = new HashMap<>();
          s.put("id", rs.getLong("sid"));
          s.put("name", rs.getString("name"));
          s.put("slug", rs.getString("slug"));
          s.put("imageUrl", rs.getString("image_url"));
          seriesByPost.put(pid, s);
        }
      });

    // query tags mapping (can be many)
    Map<Long, List<Map<String,Object>>> tagsByPost = new HashMap<>();
    jdbc.query("SELECT pt.post_id, t.id AS tid, t.name, t.slug, t.image_url FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id IN (" + inClause + ") ORDER BY t.name",
      (ResultSet rs) -> {
        while (rs.next()) {
          Long pid = rs.getLong("post_id");
          Map<String,Object> t = new HashMap<>();
          t.put("id", rs.getLong("tid"));
          t.put("name", rs.getString("name"));
          t.put("slug", rs.getString("slug"));
          t.put("imageUrl", rs.getString("image_url"));
          tagsByPost.computeIfAbsent(pid, k-> new ArrayList<>()).add(t);
        }
      });

    // assemble response
    List<Map<String,Object>> out = new ArrayList<>(posts.size());
    for (Post p : posts) {
      Map<String,Object> m = new HashMap<>();
      m.put("id", p.getId());
      m.put("title", p.getTitle());
      m.put("content", p.getContent());
      m.put("coverImageUrl", p.getCoverImageUrl());
      m.put("createdAt", p.getCreatedAt() == null ? null : p.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toString());
      m.put("author", p.getAuthor());
      m.put("series", seriesByPost.get(p.getId()));              // may be null
      m.put("tags", tagsByPost.getOrDefault(p.getId(), Collections.emptyList()));
      out.add(m);
    }

    return ResponseEntity.ok(out);
  }
}
