package com.blog.blogapp.features.notifications;

/**
 * Simple request body used when admin creates a notification.
 */
public class CreateNotificationRequest {

    private String title;
    private String message;
    private String link; // optional: e.g. "/posts/1" or "https://…"

    // ---- getters & setters ----

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
