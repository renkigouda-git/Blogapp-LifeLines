package com.blog.blogapp.features.admin.dto;

public class FeatureSlotDto {

    private Long id;
    private String name;
    private Long postId;
    private String postTitle;

    public FeatureSlotDto() {}

    public FeatureSlotDto(Long id, String name, Long postId, String postTitle) {
        this.id = id;
        this.name = name;
        this.postId = postId;
        this.postTitle = postTitle;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getPostTitle() { return postTitle; }
    public void setPostTitle(String postTitle) { this.postTitle = postTitle; }
}
