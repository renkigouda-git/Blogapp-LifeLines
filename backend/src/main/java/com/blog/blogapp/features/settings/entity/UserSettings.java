package com.blog.blogapp.features.settings.entity;

import com.blog.blogapp.features.users.entity.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // GENERAL
    @Column(nullable = false)
    private boolean startAtLogin = false;

    @Column(nullable = false)
    private boolean emojiReplace = true;

    @Column(nullable = false)
    private boolean editorConfirm = true;

    // APPEARANCE
    @Column(nullable = false)
    private String appTheme = "system";

    @Column(nullable = false)
    private String cardDensity = "comfortable";

    @Column(nullable = false)
    private boolean animationsEnabled = true;

    // NOTIFICATIONS
    @Column(nullable = false)
    private boolean notifyAdminAnnouncements = true;

    @Column(nullable = false)
    private boolean notifyComments = true;

    @Column(nullable = false)
    private String notifyEmailDigest = "off";

    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    public void touch() {
        updatedAt = Instant.now();
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isStartAtLogin() {
        return startAtLogin;
    }

    public void setStartAtLogin(boolean startAtLogin) {
        this.startAtLogin = startAtLogin;
    }

    public boolean isEmojiReplace() {
        return emojiReplace;
    }

    public void setEmojiReplace(boolean emojiReplace) {
        this.emojiReplace = emojiReplace;
    }

    public boolean isEditorConfirm() {
        return editorConfirm;
    }

    public void setEditorConfirm(boolean editorConfirm) {
        this.editorConfirm = editorConfirm;
    }

    public String getAppTheme() {
        return appTheme;
    }

    public void setAppTheme(String appTheme) {
        this.appTheme = appTheme;
    }

    public String getCardDensity() {
        return cardDensity;
    }

    public void setCardDensity(String cardDensity) {
        this.cardDensity = cardDensity;
    }

    public boolean isAnimationsEnabled() {
        return animationsEnabled;
    }

    public void setAnimationsEnabled(boolean animationsEnabled) {
        this.animationsEnabled = animationsEnabled;
    }

    public boolean isNotifyAdminAnnouncements() {
        return notifyAdminAnnouncements;
    }

    public void setNotifyAdminAnnouncements(boolean notifyAdminAnnouncements) {
        this.notifyAdminAnnouncements = notifyAdminAnnouncements;
    }

    public boolean isNotifyComments() {
        return notifyComments;
    }

    public void setNotifyComments(boolean notifyComments) {
        this.notifyComments = notifyComments;
    }

    public String getNotifyEmailDigest() {
        return notifyEmailDigest;
    }

    public void setNotifyEmailDigest(String notifyEmailDigest) {
        this.notifyEmailDigest = notifyEmailDigest;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
