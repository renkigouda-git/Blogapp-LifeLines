package com.blog.blogapp.features.tags;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.util.*;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class TagPostsController {

    private final JdbcTemplate jdbc;

    public TagPostsController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // GET /api/tags/{slug}/posts
    @GetMapping("/{slug}/posts")
    public ResponseEntity<List<Map<String,Object>>> postsByTag(@PathVariable String slug) {
        String sql = "SELECT p.id, p.title, p.cover_image_url, p.created_at " +
                     "FROM posts p JOIN post_tags pt ON pt.post_id = p.id " +
                     "JOIN tags t ON t.id = pt.tag_id " +
                     "WHERE t.slug = ? ORDER BY p.created_at DESC";
        List<Map<String,Object>> rows = jdbc.query(sql, new Object[]{slug}, (ResultSet rs, int rowNum) -> {
            Map<String,Object> m = new HashMap<>();
            m.put("id", rs.getLong("id"));
            m.put("title", rs.getString("title"));
            m.put("coverImageUrl", rs.getString("cover_image_url"));
            try {
                java.sql.Timestamp ts = rs.getTimestamp("created_at");
                m.put("createdAt", ts == null ? null : ts.toInstant().toString());
            } catch (Exception e) {
                m.put("createdAt", null);
            }
            return m;
        });
        return ResponseEntity.ok(rows);
    }
}
