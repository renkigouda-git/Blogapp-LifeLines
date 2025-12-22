package com.blog.blogapp.features.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class AuthController {
  private final AuthService auth;
  public AuthController(AuthService auth){ this.auth = auth; }

  record Req(String name, String email, String password) {}

  @PostMapping("/register")
  public ResponseEntity<Map<String,Object>> register(@RequestBody Req r){
    return ResponseEntity.ok(auth.register(r.name(), r.email(), r.password()));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Req r){
      try {
          return ResponseEntity.ok(auth.login(r.email(), r.password()));
      } catch (IllegalStateException e) {
          if ("VERIFY_EMAIL".equals(e.getMessage())) {
              return ResponseEntity.status(403).body(
                  Map.of("error", "verify-email")
              );
          }
          return ResponseEntity.badRequest().body(
              Map.of("error", "Invalid credentials")
          );
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(
              Map.of("error", "Invalid credentials")
          );
      }
  }

}
