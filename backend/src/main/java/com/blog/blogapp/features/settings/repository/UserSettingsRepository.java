// src/main/java/com/blog/blogapp/features/settings/repository/UserSettingsRepository.java
package com.blog.blogapp.features.settings.repository;

import com.blog.blogapp.features.settings.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUserId(Long userId);
}
