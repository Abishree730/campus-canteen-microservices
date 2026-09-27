package com.canteen.order_service.service;

import com.canteen.order_service.config.RabbitMQConfig;
import com.canteen.order_service.dto.OrderEvent;
import com.canteen.order_service.entity.FoodOrder;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderEventPublisher {

    private final AmqpTemplate amqpTemplate;

    public OrderEventPublisher(AmqpTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    public void publishOrderCreated(FoodOrder order) {

        OrderEvent event = createEvent(order, "ORDER_CREATED");

        amqpTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ORDER_CREATED_ROUTING_KEY,
                event
        );

        System.out.println(
                "ORDER_CREATED event published for order: "
                        + order.getId()
        );
    }

    public void publishOrderStatusUpdated(FoodOrder order) {

        OrderEvent event = createEvent(order, "ORDER_STATUS_UPDATED");

        amqpTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ORDER_STATUS_ROUTING_KEY,
                event
        );

        System.out.println(
                "ORDER_STATUS_UPDATED event published for order: "
                        + order.getId()
        );
    }

    private OrderEvent createEvent(
            FoodOrder order,
            String eventType) {

        return new OrderEvent(
                order.getId(),
                order.getUserId(),
                order.getFoodItemId(),
                order.getQuantity(),
                order.getTotalAmount(),
                order.getStatus() != null
                        ? order.getStatus().name()
                        : null,
                eventType,
                order.getOrderedAt()
        );
    }
}