package com.canteen.user_service.dto;

public class LoginResponse {

    private final String message;
    private final Long userId;
    private final String name;
    private final String role;

    public LoginResponse(String message, Long userId, String name, String role) {
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }
}