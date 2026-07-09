package com.crm.service;

import com.crm.dto.LoginRequestDTO;
import com.crm.dto.LoginResponseDTO;
import com.crm.dto.UserRequestDTO;
import com.crm.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    
    LoginResponseDTO login(LoginRequestDTO loginRequest);

    UserResponseDTO createUser(UserRequestDTO userRequest);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    UserResponseDTO updateUser(Long id, UserRequestDTO userRequest);

    void deleteUser(Long id);
}
