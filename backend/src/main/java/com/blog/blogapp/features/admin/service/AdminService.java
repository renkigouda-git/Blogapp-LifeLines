package com.blog.blogapp.features.admin.service;

import com.blog.blogapp.features.admin.dto.AdminUserDto;
import com.blog.blogapp.features.admin.dto.ModerationItemDto;
import com.blog.blogapp.features.admin.dto.FeatureSlotDto;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.blog.blogapp.features.users.entity.Role;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;

    // In-memory demo lists for moderation & feature slots (no DB impact)
    private final Map<Long, ModerationItemDto> moderationItems = new ConcurrentHashMap<>();
    private final Map<Long, FeatureSlotDto> featureSlots = new ConcurrentHashMap<>();

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;

        // Seed some demo data for moderation & feature slots
        if (moderationItems.isEmpty()) {
            moderationItems.put(1L, new ModerationItemDto(
                    1L, "POST", "Spammy post", "Buy now!!!", "alice",
                    "PENDING", LocalDateTime.now().minusHours(2)
            ));
            moderationItems.put(2L, new ModerationItemDto(
                    2L, "COMMENT", null, "Bad words in comment", "bob",
                    "PENDING", LocalDateTime.now().minusHours(1)
            ));
        }
        if (featureSlots.isEmpty()) {
            featureSlots.put(1L, new FeatureSlotDto(1L, "Homepage Hero", null, null));
            featureSlots.put(2L, new FeatureSlotDto(2L, "Editor's Pick", null, null));
            featureSlots.put(3L, new FeatureSlotDto(3L, "Spotlight", null, null));
        }
    }

    // -------- Users --------

    public List<AdminUserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(u -> new AdminUserDto(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole().toString(),
                        u.isBanned()          // ✅
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserDto changeUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.valueOf(role.toUpperCase()));

        User saved = userRepository.save(user);
        return new AdminUserDto(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole().toString(),
                saved.isBanned()
        );
    }

    
    @Transactional
    public AdminUserDto setUserBanned(Long userId, boolean banned) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBanned(banned);

        User saved = userRepository.save(user);
        return new AdminUserDto(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole().toString(),
                saved.isBanned()
        );
    }

    // -------- Moderation (in-memory stub) --------

    public List<ModerationItemDto> getModerationQueue() {
        return new ArrayList<>(moderationItems.values());
    }

    public ModerationItemDto moderationAction(Long id, String action) {
        ModerationItemDto item = moderationItems.get(id);
        if (item == null) throw new RuntimeException("Moderation item not found");

        String status = item.getStatus();
        switch (action.toLowerCase()) {
            case "approve" -> status = "APPROVED";
            case "reject" -> status = "REJECTED";
            case "delete" -> status = "DELETED";
        }
        item.setStatus(status);
        return item;
    }

    // -------- Feature slots (in-memory stub) --------

    public List<FeatureSlotDto> getFeatureSlots() {
        return new ArrayList<>(featureSlots.values());
    }

    public FeatureSlotDto assignFeatureSlot(Long slotId, Long postId) {
        FeatureSlotDto slot = featureSlots.get(slotId);
        if (slot == null) throw new RuntimeException("Slot not found");

        slot.setPostId(postId);
        // For now we don’t know post title; we keep it null or "Post #" style
        slot.setPostTitle(postId != null ? "Post #" + postId : null);
        return slot;
    }
}
