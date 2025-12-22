package com.blog.blogapp.features.auth.reset;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUserId(Long userId);
}
