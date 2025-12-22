package com.blog.blogapp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  private final Key key;
  private final long expirationMs;

  public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration}") long exp){
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.expirationMs = exp;
  }

  public String generateToken(String subject, String role){
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationMs);
    return Jwts.builder().setSubject(subject).claim("role", role).setIssuedAt(now).setExpiration(exp).signWith(key).compact();
  }

  public Jws<Claims> parse(String token){
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
  }
}
