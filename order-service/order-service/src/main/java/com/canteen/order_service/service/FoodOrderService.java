package com.canteen.order_service.service;

import com.canteen.order_service.dto.FoodItemResponse;
import com.canteen.order_service.dto.OrderRequest;
import com.canteen.order_service.entity.FoodOrder;
import com.canteen.order_service.entity.OrderStatus;
import com.canteen.order_service.exception.FoodItemUnavailableException;
import com.canteen.order_service.exception.FoodOrderNotFoundException;
import com.canteen.order_service.repository.FoodOrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import com.canteen.order_service.exception.UserNotFoundException;
import java.util.List;
import com.canteen.order_service.exception.UserServiceUnavailableException;
@Service
public class FoodOrderService {

    private final FoodOrderRepository foodOrderRepository;
    private final RestTemplate restTemplate;
    private final OrderEventPublisher orderEventPublisher;
    private final String menuServiceUrl;
    private final String userServiceUrl;

    public FoodOrderService(
            FoodOrderRepository foodOrderRepository,
            RestTemplate restTemplate,
            OrderEventPublisher orderEventPublisher,
            @Value("${menu-service.url}") String menuServiceUrl,
            @Value("${user-service.url}") String userServiceUrl) {
        this.foodOrderRepository = foodOrderRepository;
        this.restTemplate = restTemplate;
        this.orderEventPublisher = orderEventPublisher;
        this.menuServiceUrl = menuServiceUrl;
        this.userServiceUrl = userServiceUrl;
    }

    public FoodOrder createOrder(OrderRequest orderRequest) {
        verifyUserExists(orderRequest.getUserId());

        FoodItemResponse foodItem = getFoodItemFromMenuService(
                orderRequest.getFoodItemId()
        );

        if (!Boolean.TRUE.equals(foodItem.getAvailable())) {
            throw new FoodItemUnavailableException(
                    "Food item is currently unavailable"
            );
        }

        double totalAmount = foodItem.getPrice() * orderRequest.getQuantity();

        FoodOrder foodOrder = new FoodOrder(
                orderRequest.getUserId(),
                orderRequest.getFoodItemId(),
                orderRequest.getQuantity()
        );

        foodOrder.setTotalAmount(totalAmount);

        FoodOrder savedOrder = foodOrderRepository.save(foodOrder);

        orderEventPublisher.publishOrderCreated(savedOrder);

        return savedOrder;
    }

    private FoodItemResponse getFoodItemFromMenuService(Long foodItemId) {
        try {
            FoodItemResponse foodItem = restTemplate.getForObject(
                    menuServiceUrl + "/api/menu/items/{id}",
                    FoodItemResponse.class,
                    foodItemId
            );

            if (foodItem == null) {
                throw new FoodItemUnavailableException(
                        "Food item could not be found"
                );
            }

            return foodItem;
        } catch (RestClientException exception) {
            throw new FoodItemUnavailableException(
                    "Food item could not be verified. Ensure Menu Service is running."
            );
        }
    }
    private void verifyUserExists(Long userId) {
        try {
            restTemplate.getForObject(
                    userServiceUrl + "/api/users/{id}",
                    Object.class,
                    userId
            );
        } catch (org.springframework.web.client.HttpClientErrorException.NotFound exception) {
            throw new UserNotFoundException(userId);
        } catch (RestClientException exception) {
            throw new UserServiceUnavailableException();
        }
    }

    public List<FoodOrder> getAllOrders() {
        return foodOrderRepository.findAll();
    }

    public FoodOrder getOrderById(Long id) {
        return foodOrderRepository.findById(id)
                .orElseThrow(() -> new FoodOrderNotFoundException(id));
    }

    public List<FoodOrder> getOrdersByUserId(Long userId) {
        return foodOrderRepository.findByUserId(userId);
    }

    public FoodOrder updateOrderStatus(Long id, OrderStatus status) {
        FoodOrder foodOrder = getOrderById(id);
        foodOrder.setStatus(status);

        FoodOrder updatedOrder = foodOrderRepository.save(foodOrder);

        orderEventPublisher.publishOrderStatusUpdated(updatedOrder);

        return updatedOrder;
    }
}