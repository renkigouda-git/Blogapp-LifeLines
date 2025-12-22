package com.blog.blogapp.features.users.controller;

import com.blog.blogapp.features.users.dto.ProfileDto;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/me/profile")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:3000","http://localhost:4200"})
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/me/profile
    @GetMapping
    public ResponseEntity<ProfileDto> getProfile(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<User> opt = userRepository.findByEmail(auth.getName());
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        User user = opt.get();
        return ResponseEntity.ok(ProfileDto.from(user));
    }

    // PUT /api/me/profile
    @PutMapping
    public ResponseEntity<ProfileDto> updateProfile(
            @RequestBody ProfileDto req,
            Authentication auth
    ) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<User> opt = userRepository.findByEmail(auth.getName());
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        User user = opt.get();

        // update fields – email is kept same here, you can allow changing it if you want
        if (req.displayName() != null && !req.displayName().isBlank()) {
            user.setName(req.displayName());  // or setDisplayName(...)
        }

        if (req.bio() != null) {
            user.setBio(req.bio());
        }

        if (req.location() != null) {
            user.setLocation(req.location());
        }

        if (req.website() != null) {
            user.setWebsite(req.website());
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(ProfileDto.from(saved));
    }
}
