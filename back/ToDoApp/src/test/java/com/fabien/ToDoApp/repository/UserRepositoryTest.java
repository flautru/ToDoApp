package com.fabien.ToDoApp.repository;

import com.fabien.ToDoApp.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Test
    @DisplayName("Test findByUsername existent")
    void testFindByUsernameValid() {
        User user = new User(null, "Test", "password", "roleTest");

        userRepository.save(user);

        User findingUser = userRepository.findByUsername("Test").get();

        assertEquals(user.getId(), findingUser.getId());
        assertEquals(user.getUsername(), findingUser.getUsername());
        assertEquals(user.getPassword(), findingUser.getPassword());
        assertEquals(user.getRole(), findingUser.getRole());
    }

    @Test
    @DisplayName("Test findByUsername nonexistent ")
    void testFindByUsernameInvalid() {
        Optional<User> findingUser = userRepository.findByUsername("NonExistent");

        assertEquals(Optional.empty(), findingUser);
    }


}