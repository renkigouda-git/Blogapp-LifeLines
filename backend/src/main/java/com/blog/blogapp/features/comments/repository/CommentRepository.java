package com.blog.blogapp.features.comments.repository;

import com.blog.blogapp.features.comments.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  Page<Comment> findByPostIdOrderByCreatedAtAsc(Long postId, Pageable pageable);
}
