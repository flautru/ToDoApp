package com.fabien.ToDoApp.integration;

import com.fabien.ToDoApp.model.User;
import com.fabien.ToDoApp.repository.UserRepository;
import com.fabien.ToDoApp.security.jwt.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class JwtSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String validToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        User user = new User(null, "securedUser", passwordEncoder.encode("secret"), "USER");
        userRepository.save(user);
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("securedUser")
                .password("secret")
                .roles("USER")
                .build();
        validToken = jwtUtils.generateJwtToken(userDetails);
    }

    @Test
    @DisplayName("givenNoToken_whenAccessProtectedEndpoint_thenReturn401Unauthorized")
    void givenNoToken_whenAccessProtectedEndpoint_thenReturn401Unauthorized() throws Exception {
        mockMvc.perform(get("/api/tasks")) // secured endpoint
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("givenValidToken_whenAccessProtectedEndpoint_thenReturn200Ok")
    void givenValidToken_whenAccessProtectedEndpoint_thenReturn200Ok() throws Exception {
        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("givenInvalidToken_whenAccessProtectedEndpoint_thenReturn401Unauthorized")
    void givenInvalidToken_whenAccessProtectedEndpoint_thenReturn401Unauthorized() throws Exception {
        String invalidToken = "Bearer invalid.token.value";

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", invalidToken))
                .andExpect(status().isUnauthorized());
    }
}
