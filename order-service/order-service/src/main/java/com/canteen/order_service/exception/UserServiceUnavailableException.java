package com.canteen.order_service.exception;

public class UserServiceUnavailableException extends RuntimeException {

    public UserServiceUnavailableException() {
        super("User Service is currently unavailable. Please try again later.");
    }
}
