package com.crm.controller;

import com.crm.dto.ApiResponse;
import com.crm.dto.LoginRequestDTO;
import com.crm.dto.LoginResponseDTO;
import com.crm.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequest, HttpSession session) {
        LoginResponseDTO response = userService.login(loginRequest);
        
        // Store user in session
        session.setAttribute("user", response);
        
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> getProfile(HttpSession session) {
        LoginResponseDTO user = (LoginResponseDTO) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized: Please login first"));
        }
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", user));
    }
}
