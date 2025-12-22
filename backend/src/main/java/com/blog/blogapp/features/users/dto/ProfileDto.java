package com.blog.blogapp.features.users.dto;

import com.blog.blogapp.features.users.entity.User;

public record ProfileDto(
        String displayName,
        String email,
        String bio,
        String location,
        String website
) {
    public static ProfileDto from(User user) {
        return new ProfileDto(
                user.getName(),      // or user.getDisplayName() if that’s your method
                user.getEmail(),
                user.getBio(),
                user.getLocation(),
                user.getWebsite()
        );
    }
}
