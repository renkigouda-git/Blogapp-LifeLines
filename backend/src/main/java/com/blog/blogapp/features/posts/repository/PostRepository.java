package com.blog.blogapp.features.posts.repository;

import com.blog.blogapp.features.posts.entity.Post;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    // -----------------------------
    // YOUR ORIGINAL METHODS
    // -----------------------------
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Post> findAllByAuthorId(Long authorId);

    // -----------------------------
    // NEW METHODS (Series + Tags)
    // -----------------------------

    // Find posts by SERIES slug
    @Query(value =
            "SELECT p.* FROM posts p " +
            "JOIN post_series ps ON ps.post_id = p.id " +
            "JOIN series s ON s.id = ps.series_id " +
            "WHERE s.slug = :slug " +
            "ORDER BY p.created_at DESC",
            nativeQuery = true)
    List<Post> findPostsBySeriesSlug(@Param("slug") String slug);

    // Find posts by TAG slug
    @Query(value =
            "SELECT p.* FROM posts p " +
            "JOIN post_tags pt ON pt.post_id = p.id " +
            "JOIN tags t ON t.id = pt.tag_id " +
            "WHERE t.slug = :slug " +
            "ORDER BY p.created_at DESC",
            nativeQuery = true)
    List<Post> findPostsByTagSlug(@Param("slug") String slug);
}
