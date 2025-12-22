package com.blog.blogapp.features.comments.dto;

import java.time.LocalDateTime;

public record CommentResponse(
    Long id,
    Long postId,
    String text,
    String author,
    String authorEmail,
    LocalDateTime createdAt
) {}
