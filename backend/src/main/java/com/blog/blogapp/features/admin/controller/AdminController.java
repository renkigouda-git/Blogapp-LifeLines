package com.blog.blogapp.features.admin.controller;

import com.blog.blogapp.features.admin.dto.AdminUserDto;
import com.blog.blogapp.features.admin.dto.ModerationItemDto;
import com.blog.blogapp.features.admin.dto.FeatureSlotDto;
import com.blog.blogapp.features.admin.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // adjust if needed
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ---------- Users ----------

    @GetMapping("/users")
    public List<AdminUserDto> getUsers() {
        return adminService.getAllUsers();
    }

    @PostMapping("/users/{id}/role")
    public AdminUserDto changeRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        return adminService.changeUserRole(id, role);
    }

    @PostMapping("/users/{id}/ban")
    public AdminUserDto banUser(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Boolean banned = body.get("banned");
        return adminService.setUserBanned(id, banned != null && banned);
    }


    // ---------- Moderation (stub) ----------

    @GetMapping("/moderation")
    public List<ModerationItemDto> moderationQueue() {
        return adminService.getModerationQueue();
    }

    @PostMapping("/moderation/{id}/action")
    public ModerationItemDto moderationAction(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String action = body.get("action");
        return adminService.moderationAction(id, action);
    }

    // ---------- Feature Slots (stub) ----------

    @GetMapping("/feature-slots")
    public List<FeatureSlotDto> featureSlots() {
        return adminService.getFeatureSlots();
    }

    @PutMapping("/feature-slots/{slotId}")
    public FeatureSlotDto setSlot(
            @PathVariable Long slotId,
            @RequestBody Map<String, Object> body
    ) {
        Long postId = null;
        if (body.get("postId") != null) {
            postId = Long.valueOf(body.get("postId").toString());
        }
        return adminService.assignFeatureSlot(slotId, postId);
    }

    // ---------- Simple stats (optional) ----------

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        // You can extend this later with real DB queries
        return ResponseEntity.ok(
                Map.of(
                        "usersCount", 0,
                        "postsCount", 0,
                        "commentsCount", 0,
                        "flaggedCount", adminService.getModerationQueue().size()
                )
        );
    }
}
