package com.fabien.ToDoApp.mapper;

import com.fabien.ToDoApp.dto.UserDto;
import com.fabien.ToDoApp.model.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class UserMapperTest {

    private UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Test
    void givenValidUser_whenMapToDto_thenReturnUserDto() {
        User user = new User(1L, "nameTest", "1234", "roleTest");

        UserDto userDto = userMapper.toDto(user);

        assertEquals(user.getId(), userDto.getId());
        assertEquals(user.getUsername(), userDto.getUsername());
        assertEquals(user.getRole(), userDto.getRole());
    }

    @Test
    void givenValidUserDto_whenMapToDto_thenReturnUser() {
        UserDto userDto = new UserDto(1L, "nameTest", "roleTest");

        User user = userMapper.toEntity(userDto);

        assertEquals(userDto.getId(), user.getId());
        assertEquals(userDto.getUsername(), user.getUsername());
        assertEquals(userDto.getRole(), user.getRole());
        assertNull(user.getPassword());
    }

    @Test
    void givenValidUserWithNullValue_whenMapToDto_thenReturnUserDtoWithNullValue() {
        User user = new User();

        UserDto userDto = userMapper.toDto(user);

        assertNull(userDto.getId());
        assertNull(userDto.getUsername());
        assertNull(userDto.getRole());
    }

    @Test
    void givenValidUserDtoWithNullValue_whenMapToDto_thenReturnUserWithNullValue() {
        UserDto userDto = new UserDto();

        User user = userMapper.toEntity(userDto);

        assertNull(user.getId());
        assertNull(user.getUsername());
        assertNull(user.getRole());
        assertNull(user.getPassword());

    }

    @Test
    void givenNullUser_whenMapToDto_thenReturnNull() {
        UserDto userDto = userMapper.toDto(null);

        assertNull(userDto);
    }

    @Test
    void givenNullUserDto_whenMapToEntity_thenReturnNull() {
        User user = userMapper.toEntity(null);

        assertNull(user);

    }
}