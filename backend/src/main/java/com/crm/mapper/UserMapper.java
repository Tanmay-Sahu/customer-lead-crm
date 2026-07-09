package com.crm.mapper;

import com.crm.dto.UserRequestDTO;
import com.crm.dto.UserResponseDTO;
import com.crm.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    User toEntity(UserRequestDTO requestDTO);

    UserResponseDTO toResponseDTO(User entity);

    List<UserResponseDTO> toResponseDTOList(List<User> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    void updateEntityFromDTO(UserRequestDTO requestDTO, @MappingTarget User entity);
}
