package com.canteen.order_service.exception;

public class FoodOrderNotFoundException extends RuntimeException {

    public FoodOrderNotFoundException(Long id) {
        super("Order not found with id: " + id);
    }
}
