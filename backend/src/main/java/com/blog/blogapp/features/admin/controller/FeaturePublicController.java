// src/main/java/com/blog/blogapp/features/admin/controller/FeaturePublicController.java
package com.blog.blogapp.features.admin.controller;

import com.blog.blogapp.features.admin.dto.FeatureSlotDto;
import com.blog.blogapp.features.admin.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "http://localhost:5173")
public class FeaturePublicController {

    private final AdminService adminService;

    public FeaturePublicController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Public read-only view of the slots
    @GetMapping
    public List<FeatureSlotDto> getFeatureSlots() {
        return adminService.getFeatureSlots();
    }
}
