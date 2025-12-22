// src/main/java/com/blog/blogapp/features/settings/controller/UserSettingsController.java
package com.blog.blogapp.features.settings.controller;

import com.blog.blogapp.features.settings.dto.UserSettingsDto;
import com.blog.blogapp.features.settings.service.UserSettingsService;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/me/settings")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:3000","http://localhost:4200"})
public class UserSettingsController {

    private final UserSettingsService service;
    private final UserRepository userRepository;

    public UserSettingsController(UserSettingsService service,
                                  UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    // helper: get current user id from Authentication (email is principal)
    private Long getCurrentUserId(Authentication auth) {
        if (auth == null) return null;

        Optional<User> opt = userRepository.findByEmail(auth.getName());
        return opt.map(User::getId).orElse(null);
    }

    // GET /api/me/settings
    @GetMapping
    public ResponseEntity<UserSettingsDto> getMySettings(Authentication auth) {
        Long userId = getCurrentUserId(auth);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        UserSettingsDto dto = service.getForUser(userId);
        return ResponseEntity.ok(dto);
    }

    // PUT /api/me/settings
    @PutMapping
    public ResponseEntity<UserSettingsDto> updateMySettings(
            Authentication auth,
            @RequestBody UserSettingsDto dto
    ) {
        Long userId = getCurrentUserId(auth);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        UserSettingsDto updated = service.updateForUser(userId, dto);
        return ResponseEntity.ok(updated);
    }
}
