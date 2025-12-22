package com.blog.blogapp.security;

import com.blog.blogapp.security.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // -----------------------------------------------------
    //                SECURITY RULES (CLEAN)
    // -----------------------------------------------------
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(c -> c.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth

                // allow OPTIONS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // public auth endpoints
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/resend-verification").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/verify/**").permitAll()

                // public password endpoints
                .requestMatchers("/api/password/**").permitAll()

                // OAuth2 public
                .requestMatchers("/oauth2/**", "/login/**").permitAll()

                // public read endpoints
                .requestMatchers(HttpMethod.GET,
                        "/api/posts/**",
                        "/api/series/**",
                        "/api/tags/**",
                        "/api/files/**",
                        "/api/features/**"
                ).permitAll()

                // admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // everything else needs login
                .anyRequest().authenticated()
            )

            // custom authentication handler
            .exceptionHandling(exc -> exc
                .authenticationEntryPoint((request, response, ex) -> {
                    String uri = request.getRequestURI();
                    if (uri != null && uri.startsWith("/api/")) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"Unauthorized\"}");
                    } else {
                        response.sendRedirect("/login");
                    }
                })
            )

            .oauth2Login(oauth -> oauth
                .successHandler((req, res, auth) -> res.sendRedirect("http://localhost:5173/dashboard"))
                .failureHandler((req, res, ex) -> res.sendRedirect("http://localhost:5173/login?error=oauth"))
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // -----------------------------------------------------
    //                CORS CONFIG (FINAL)
    // -----------------------------------------------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration cfg = new CorsConfiguration();

        // allow these origins
        cfg.setAllowedOriginPatterns(List.of("*"));  // allows localhost:5173 perfectly

        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);

        return source;
    }

    // -----------------------------------------------------
    //             OAUTH CLIENT CONFIG
    // -----------------------------------------------------
    @Bean
    ClientRegistrationRepository clientRegistrationRepository(
            @Value("${app.oauth.google.client-id}") String clientId,
            @Value("${app.oauth.google.client-secret}") String clientSecret) {

        ClientRegistration google = ClientRegistration.withRegistrationId("google")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("openid", "profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://oauth2.googleapis.com/token")
                .userInfoUri("https://openidconnect.googleapis.com/v1/userinfo")
                .userNameAttributeName("sub")
                .clientName("Google")
                .build();

        return new InMemoryClientRegistrationRepository(google);
    }

    @Bean
    OAuth2AuthorizedClientService authorizedClientService(ClientRegistrationRepository repo) {
        return new InMemoryOAuth2AuthorizedClientService(repo);
    }
}
