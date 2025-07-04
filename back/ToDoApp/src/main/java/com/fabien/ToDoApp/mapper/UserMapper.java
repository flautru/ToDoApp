package com.fabien.ToDoApp.mapper;

import com.fabien.ToDoApp.dto.UserDto;
import com.fabien.ToDoApp.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    User toEntity(UserDto userDto);
}
