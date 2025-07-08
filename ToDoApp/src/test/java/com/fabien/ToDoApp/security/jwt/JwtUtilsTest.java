package com.fabien.ToDoApp.security.jwt;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private User testUser;

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        testUser = new User("testUser", "password", List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    public void givenUser_whenGenerateJwtToken_thenTokenIsValid() {
        String token = jwtUtils.generateJwtToken(testUser);

        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    public void givenValidToken_whenGetUsername_thenReturnUsername() {
        String token = jwtUtils.generateJwtToken(testUser);
        String username = jwtUtils.getUsernameFromJwtToken(token);

        assertEquals("testUser", username);
    }

    @Test
    public void givenInvalidToken_whenValidateJwtToken_thenReturnFalse() {
        String invalidToken = "invalid.token.value";

        assertFalse(jwtUtils.validateJwtToken(invalidToken));
    }

    @Test
    public void givenInvalidFormatToken_whenValidateJwtToken_thenReturnFalse() {
        String invalidToken = "not.a.valid.token";

        JwtUtils utils = new JwtUtils();
        boolean result = utils.validateJwtToken(invalidToken);

        assertFalse(result);
    }


}