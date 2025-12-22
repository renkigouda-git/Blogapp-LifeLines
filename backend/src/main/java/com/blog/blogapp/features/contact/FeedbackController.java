package com.blog.blogapp.features.contact;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class FeedbackController {

  private final JdbcTemplate jdbc;

  public FeedbackController(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  // POST /api/contact  { name, email, subject, message }
  @PostMapping
  public ResponseEntity<?> submit(@RequestBody Map<String,Object> body) {
    String name = (String) body.getOrDefault("name", null);
    String email = (String) body.getOrDefault("email", null);
    String subject = (String) body.getOrDefault("subject", null);
    String message = (String) body.getOrDefault("message", null);

    // try to persist; if table not present, just return 200 and log
    try {
      jdbc.update("INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)",
        name, email, subject, message, Timestamp.from(Instant.now()));
      return ResponseEntity.ok(Map.of("status", "ok"));
    } catch (Exception ex) {
      // fallback: log and return ok (so frontend works)
      System.err.println("Failed to write contact message: " + ex.getMessage());
      return ResponseEntity.ok(Map.of("status", "ok", "note", "not persisted"));
    }
  }
}
