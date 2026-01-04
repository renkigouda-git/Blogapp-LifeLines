package com.blog.blogapp.features.settings.dto;

import com.blog.blogapp.features.settings.entity.UserSettings;

public record UserSettingsDto(
        boolean startAtLogin,
        boolean emojiReplace,
        boolean editorConfirm,
        String appTheme,
        String cardDensity,
        boolean animationsEnabled,
        boolean notifyAdminAnnouncements,
        boolean notifyComments,
        String notifyEmailDigest,String profileVisibility,
        String commentPermission
) {

    public static UserSettingsDto from(UserSettings s) {
        return new UserSettingsDto(
                s.isStartAtLogin(),
                s.isEmojiReplace(),
                s.isEditorConfirm(),
                s.getAppTheme(),
                s.getCardDensity(),
                s.isAnimationsEnabled(),
                s.isNotifyAdminAnnouncements(),
                s.isNotifyComments(),
                s.getNotifyEmailDigest(),s.getProfileVisibility(),
                s.getCommentPermission()
        );
    }

    public void applyTo(UserSettings s) {
        s.setStartAtLogin(startAtLogin);
        s.setEmojiReplace(emojiReplace);
        s.setEditorConfirm(editorConfirm);
        s.setAppTheme(appTheme);
        s.setCardDensity(cardDensity);
        s.setAnimationsEnabled(animationsEnabled);
        s.setNotifyAdminAnnouncements(notifyAdminAnnouncements);
        s.setNotifyComments(notifyComments);
        s.setNotifyEmailDigest(notifyEmailDigest);
        s.setProfileVisibility(profileVisibility);
        s.setCommentPermission(commentPermission);
    }
}
