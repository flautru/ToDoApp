package com.fabien.ToDoApp.service.user;

import com.fabien.ToDoApp.model.User;

public interface UserService {
    User getUserById(Long id);

    User save(User user);

    void delete(Long id);
}
