package com.canteen.notification_service.dto;

public class UserNotification {

    private Long userId;
    private String message;

    public UserNotification() {
    }

    public UserNotification(Long userId, String message) {
        this.userId = userId;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}