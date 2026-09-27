package com.canteen.order_service.exception;

public class FoodItemUnavailableException extends RuntimeException {

    public FoodItemUnavailableException(String message) {
        super(message);
    }
}