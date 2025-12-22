package com.blog.blogapp.features.comments.controller;

import com.blog.blogapp.features.comments.dto.CommentRequest;
import com.blog.blogapp.features.comments.dto.CommentResponse;
import com.blog.blogapp.features.comments.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class CommentController {

  private final CommentService service;
  public CommentController(CommentService service){ this.service = service; }

  // Public – list comments for a post
  @GetMapping("/posts/{postId}/comments")
  public ResponseEntity<List<CommentResponse>> list(
      @PathVariable Long postId,
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="100") int size) {
    return ResponseEntity.ok(service.list(postId, page, size));
  }

  // JWT – create
  @PostMapping("/posts/{postId}/comments")
  public ResponseEntity<CommentResponse> create(
      @PathVariable Long postId,
      @RequestBody CommentRequest req,
      Authentication auth) {
    return ResponseEntity.ok(service.create(postId, req, auth));
  }

  // JWT – delete (author or admin)
  @DeleteMapping("/comments/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
    service.delete(id, auth);
    return ResponseEntity.noContent().build();
  }
}
