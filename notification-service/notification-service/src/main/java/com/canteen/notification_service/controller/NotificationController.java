package com.canteen.notification_service.controller;

import com.canteen.notification_service.entity.Notification;
import com.canteen.notification_service.service.NotificationListener;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationListener notificationListener;

    public NotificationController(
            NotificationListener notificationListener) {

        this.notificationListener =
                notificationListener;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>>
    getNotificationsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationListener
                        .getNotificationsByUserId(userId)
        );
    }
}