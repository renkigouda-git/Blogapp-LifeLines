package com.blog.blogapp.features.users.repository;

import com.blog.blogapp.features.users.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
