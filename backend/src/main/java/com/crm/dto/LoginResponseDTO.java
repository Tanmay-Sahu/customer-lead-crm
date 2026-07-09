package com.crm.dto;

import com.crm.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private String username;
    private String name;
    private UserRole role;
    private String message;
}
