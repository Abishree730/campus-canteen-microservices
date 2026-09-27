package com.canteen.menu_service.exception;

public class FoodItemNotFoundException extends RuntimeException {

    public FoodItemNotFoundException(Long id) {
        super("Food item not found with id: " + id);
    }
}