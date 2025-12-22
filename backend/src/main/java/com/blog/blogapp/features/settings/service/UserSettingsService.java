package com.blog.blogapp.features.settings.service;

import com.blog.blogapp.features.settings.dto.UserSettingsDto;
import com.blog.blogapp.features.settings.entity.UserSettings;
import com.blog.blogapp.features.settings.repository.UserSettingsRepository;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

    private final UserSettingsRepository settingsRepository;
    private final UserRepository userRepository;

    public UserSettingsService(UserSettingsRepository settingsRepository,
                               UserRepository userRepository) {
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
    }

    // ❌ remove readOnly=true – this method may create (INSERT) defaults
    @Transactional
    public UserSettingsDto getForUser(Long userId) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaults(userId));
        return UserSettingsDto.from(settings);
    }

    @Transactional
    public UserSettingsDto updateForUser(Long userId, UserSettingsDto dto) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaults(userId));

        dto.applyTo(settings);
        settingsRepository.save(settings);
        return UserSettingsDto.from(settings);
    }

    // also transactional (in case it’s called from somewhere else later)
    @Transactional
    protected UserSettings createDefaults(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        UserSettings s = new UserSettings();
        s.setUser(user);

        // sensible defaults
        s.setStartAtLogin(false);
        s.setEmojiReplace(true);
        s.setEditorConfirm(true);
        s.setAppTheme("system");
        s.setCardDensity("comfortable");
        s.setAnimationsEnabled(true);
        s.setNotifyAdminAnnouncements(true);
        s.setNotifyComments(true);
        s.setNotifyEmailDigest("off");

        return settingsRepository.save(s);
    }
}
