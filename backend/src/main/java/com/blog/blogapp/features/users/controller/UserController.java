package com.blog.blogapp.features.users.controller;

import com.blog.blogapp.features.users.entity.User;
import com.blog.blogapp.features.users.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.lang.reflect.Method;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:3000","http://localhost:4200"})
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/auth/me  (existing frontends expect this)
    @GetMapping("/auth/me")
    public ResponseEntity<?> authMe(Authentication auth) {
        if (auth == null) return ResponseEntity.ok(null);
        Optional<User> u = userRepository.findByEmail(auth.getName());
        return ResponseEntity.ok(u.orElse(null));
    }

    // Friendly alias GET /api/users/me
    @GetMapping("/users/me")
    public ResponseEntity<?> usersMe(Authentication auth) {
        return authMe(auth);
    }
    @PutMapping("/users/me")
    public ResponseEntity<?> updateMe(@RequestBody Object incoming, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();

        // find current user by email (your project uses email as principal)
        Optional<com.blog.blogapp.features.users.entity.User> uOpt = userRepository.findByEmail(auth.getName());
        if (uOpt.isEmpty()) return ResponseEntity.status(404).build();
        com.blog.blogapp.features.users.entity.User u = uOpt.get();

        if (incoming == null) {
            // nothing to update
            return ResponseEntity.ok(u);
        }

        // Helper (local) method: will try to copy property propName
        // from 'incoming' (getter getPropName) to 'u' (setter setPropName)
        // if both methods exist. Uses reflection so code compiles even if
        // some getters/setters are missing in your User class.
        java.util.function.BiConsumer<String, Class<?>> copyIfPresent = (propName, paramType) -> {
            try {
                // build getter name
                String getter = "get" + propName;
                Method g = incoming.getClass().getMethod(getter);
                Object val = g.invoke(incoming);
                if (val == null) return;

                // build setter name on target user instance
                String setter = "set" + propName;
                // try to find setter; prefer the declared param type if provided
                Method s = null;
                try {
                    s = u.getClass().getMethod(setter, paramType);
                } catch (NoSuchMethodException e) {
                    // fallback: try to find any setter with that name (common in some models)
                    for (Method m : u.getClass().getMethods()) {
                        if (m.getName().equals(setter) && m.getParameterCount() == 1) {
                            s = m;
                            break;
                        }
                    }
                }
                if (s != null) {
                    s.invoke(u, val);
                }
            } catch (NoSuchMethodException ignored) {
                // incoming doesn't have getter — ignore
            } catch (Exception ex) {
                // other reflection errors — print so we can debug if needed but don't fail request
                ex.printStackTrace();
            }
        };

        // Try common properties — these names come from typical User models.
        // If your model uses different names (e.g. getDisplay_name) you can add them here.
        copyIfPresent.accept("Name", String.class);          // incoming.getName() -> u.setName(...)
        copyIfPresent.accept("DisplayName", String.class);   // incoming.getDisplayName() -> setDisplayName(...)
        copyIfPresent.accept("ImageUrl", String.class);      // incoming.getImageUrl() -> setImageUrl(...)
        copyIfPresent.accept("Email", String.class);         // incoming.getEmail() -> setEmail(...)
        copyIfPresent.accept("Phone", String.class);         // optional
        copyIfPresent.accept("Bio", String.class);           // optional

        // save and return
        com.blog.blogapp.features.users.entity.User saved = userRepository.save(u);
        return ResponseEntity.ok(saved);
    }
    // GET some public user
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // PATCH / PUT update profile of current user
   
}
