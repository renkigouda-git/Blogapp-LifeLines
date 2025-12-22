package com.blog.blogapp.features.posts.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class BrowseController {

    private final JdbcTemplate jdbc;

    public BrowseController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // GET /api/posts/featured  -> returns up to 8 featured posts
    @GetMapping("/featured")
    public ResponseEntity<List<Map<String,Object>>> featured() {
        String sql = "SELECT id, title, cover_image_url, created_at FROM posts WHERE featured = 1 ORDER BY created_at DESC LIMIT 8";
        List<Map<String,Object>> rows = jdbc.query(sql, (ResultSet rs, int rowNum) -> {
            Map<String,Object> m = new HashMap<>();
            m.put("id", rs.getLong("id"));
            m.put("title", rs.getString("title"));
            m.put("coverImageUrl", rs.getString("cover_image_url"));
            // convert created_at to ISO string if not null
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
