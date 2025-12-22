package com.blog.blogapp.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<?> handleNotFound(NotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(Map.of(
            "timestamp", Instant.now().toString(),
            "status", 404,
            "error", "Not Found",
            "message", ex.getMessage()
        ));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntime(RuntimeException ex) {
    // Generic 400; tweak if you want 403, 401, etc. in specific places
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of(
            "timestamp", Instant.now().toString(),
            "status", 400,
            "error", "Bad Request",
            "message", ex.getMessage()
        ));
  }
}
