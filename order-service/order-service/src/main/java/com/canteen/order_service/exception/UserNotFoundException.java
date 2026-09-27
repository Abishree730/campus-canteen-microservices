package com.canteen.order_service.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long userId) {
        super("User with ID " + userId + " was not found");
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}