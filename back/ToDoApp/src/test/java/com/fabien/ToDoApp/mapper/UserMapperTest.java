package com.fabien.ToDoApp.mapper;

import com.fabien.ToDoApp.dto.UserDto;
import com.fabien.ToDoApp.model.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserMapperTest {

    private UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Test
    void testToDto() {
        User user = new User(1L, "nameTest", "1234", "roleTest");

        UserDto userDto = userMapper.toDto(user);

        assertEquals(user.getId(), userDto.getId());
        assertEquals(user.getUsername(), userDto.getUsername());
        assertEquals(user.getRole(), userDto.getRole());
    }

    @Test
    void testToEntity() {
        UserDto userDto = new UserDto(1L, "nameTest", "roleTest");

        User user = userMapper.toEntity(userDto);

        assertEquals(userDto.getId(), user.getId());
        assertEquals(userDto.getUsername(), user.getUsername());
        assertEquals(userDto.getRole(), user.getRole());
    }
}