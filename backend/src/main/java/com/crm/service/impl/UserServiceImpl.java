package com.crm.service.impl;

import com.crm.dto.LoginRequestDTO;
import com.crm.dto.LoginResponseDTO;
import com.crm.dto.UserRequestDTO;
import com.crm.dto.UserResponseDTO;
import com.crm.entity.User;
import com.crm.exception.DuplicateResourceException;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.UserMapper;
import com.crm.repository.UserRepository;
import com.crm.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getUsername());
        
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password"));

        // Simplistic password check (Plain text for college project setup)
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            log.warn("Invalid password for user: {}", loginRequest.getUsername());
            throw new ResourceNotFoundException("Invalid username or password");
        }

        log.info("Login successful for user: {}", loginRequest.getUsername());
        return LoginResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .role(user.getRole())
                .message("Login successful")
                .build();
    }

    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequest) {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + userRequest.getUsername());
        }

        User user = userMapper.toEntity(userRequest);
        return userMapper.toResponseDTO(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userMapper.toResponseDTOList(userRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return userMapper.toResponseDTO(user);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Check if username changed and if new username is unique
        if (!user.getUsername().equals(userRequest.getUsername()) && userRepository.existsByUsername(userRequest.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + userRequest.getUsername());
        }

        userMapper.updateEntityFromDTO(userRequest, user);
        return userMapper.toResponseDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
