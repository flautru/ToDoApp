package com.fabien.ToDoApp.service.user;

import com.fabien.ToDoApp.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<User> findAllUsers(Pageable pageable);

    User findUserById(Long id);

    User save(User user);

    void deleteById(Long id);
}
