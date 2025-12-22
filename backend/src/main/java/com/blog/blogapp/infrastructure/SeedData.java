package com.blog.blogapp.infrastructure;

import com.blog.blogapp.features.users.entity.Role;
import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SeedData implements CommandLineRunner {

  private final UserRepository users;
  private final PasswordEncoder encoder;

  public SeedData(UserRepository users, PasswordEncoder encoder){ this.users = users; this.encoder = encoder; }

  @Override
  public void run(String... args) throws Exception {
    if (users.findByEmail("admin@gmail.com").isEmpty()){
      var a = new User("Admin", "admin@gmail.com", encoder.encode("Admin@123"), Role.ADMIN);
      users.save(a);
      System.out.println("Created admin@gmail.com/ Admin@123");
    }
  }
}
