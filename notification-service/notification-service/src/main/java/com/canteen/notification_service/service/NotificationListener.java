package com.canteen.notification_service.service;

import com.canteen.notification_service.config.RabbitMQConfig;
import com.canteen.notification_service.dto.OrderEvent;
import com.canteen.notification_service.entity.Notification;
import com.canteen.notification_service.repository.NotificationRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationListener {

    private final NotificationRepository notificationRepository;

    public NotificationListener(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleOrderEvent(OrderEvent event) {

        String message;

        if ("ORDER_CREATED".equals(event.getEventType())) {

            message = String.format(
                    "Order #%d placed successfully for user #%d. " +
                            "Quantity: %d, Total Amount: %.2f, Status: %s",
                    event.getOrderId(),
                    event.getUserId(),
                    event.getQuantity(),
                    event.getTotalAmount(),
                    event.getStatus()
            );

        } else if ("ORDER_STATUS_UPDATED"
                .equals(event.getEventType())) {

            message = String.format(
                    "Order #%d status updated to %s for user #%d.",
                    event.getOrderId(),
                    event.getStatus(),
                    event.getUserId()
            );

        } else {

            message = String.format(
                    "Received event for Order #%d with event type %s.",
                    event.getOrderId(),
                    event.getEventType()
            );
        }

        Notification notification =
                new Notification(
                        event.getUserId(),
                        message,
                        event.getEventType()
                );

        notificationRepository.save(notification);

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "        NOTIFICATION RECEIVED"
        );

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "User ID: " + event.getUserId()
        );

        System.out.println(
                "Event Type: " + event.getEventType()
        );

        System.out.println(
                message
        );

        System.out.println(
                "Notification saved to database."
        );

        System.out.println(
                "=========================================="
        );
    }

    public List<Notification> getNotificationsByUserId(
            Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }
}