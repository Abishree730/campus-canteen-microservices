package com.canteen.order_service.dto;

import java.time.LocalDateTime;

public class OrderEvent {

    private Long orderId;
    private Long userId;
    private Long foodItemId;
    private Integer quantity;
    private Double totalAmount;
    private String status;
    private String eventType;
    private LocalDateTime orderedAt;

    public OrderEvent() {
    }

    public OrderEvent(
            Long orderId,
            Long userId,
            Long foodItemId,
            Integer quantity,
            Double totalAmount,
            String status,
            String eventType,
            LocalDateTime orderedAt) {

        this.orderId = orderId;
        this.userId = userId;
        this.foodItemId = foodItemId;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.status = status;
        this.eventType = eventType;
        this.orderedAt = orderedAt;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getFoodItemId() {
        return foodItemId;
    }

    public void setFoodItemId(Long foodItemId) {
        this.foodItemId = foodItemId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDateTime getOrderedAt() {
        return orderedAt;
    }

    public void setOrderedAt(LocalDateTime orderedAt) {
        this.orderedAt = orderedAt;
    }
}