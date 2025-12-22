package com.blog.blogapp.features.series;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.util.*;

@RestController
@RequestMapping("/api/series")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class SeriesPostsController {

    private final JdbcTemplate jdbc;

    public SeriesPostsController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // GET /api/series/{slug}/posts
    @GetMapping("/{slug}/posts")
    public ResponseEntity<List<Map<String,Object>>> postsBySeries(@PathVariable String slug) {
        String sql = "SELECT p.id, p.title, p.cover_image_url, p.created_at " +
                     "FROM posts p JOIN post_series ps ON ps.post_id = p.id " +
                     "JOIN series s ON s.id = ps.series_id " +
                     "WHERE s.slug = ? ORDER BY p.created_at DESC";
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
