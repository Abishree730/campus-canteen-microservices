package com.canteen.menu_service.service;



import com.canteen.menu_service.entity.FoodItem;
import com.canteen.menu_service.exception.FoodItemNotFoundException;
import com.canteen.menu_service.repository.FoodItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;

    public FoodItemService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    public FoodItem createFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    public FoodItem getFoodItemById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new FoodItemNotFoundException(id));
    }

    public FoodItem updateFoodItem(Long id, FoodItem updatedFoodItem) {
        FoodItem existingFoodItem = getFoodItemById(id);

        existingFoodItem.setName(updatedFoodItem.getName());
        existingFoodItem.setDescription(updatedFoodItem.getDescription());
        existingFoodItem.setPrice(updatedFoodItem.getPrice());
        existingFoodItem.setAvailable(updatedFoodItem.getAvailable());

        return foodItemRepository.save(existingFoodItem);
    }

    public void deleteFoodItem(Long id) {
        FoodItem foodItem = getFoodItemById(id);
        foodItemRepository.delete(foodItem);
    }
}