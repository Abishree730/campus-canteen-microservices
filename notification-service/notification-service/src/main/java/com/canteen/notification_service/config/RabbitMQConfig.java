package com.canteen.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "canteen.order.exchange";

    public static final String QUEUE_NAME = "canteen.notification.queue";

    public static final String ORDER_CREATED_ROUTING_KEY = "order.created";

    public static final String ORDER_STATUS_ROUTING_KEY = "order.status.updated";

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public Binding orderCreatedBinding(
            Queue notificationQueue,
            DirectExchange orderExchange) {

        return BindingBuilder
                .bind(notificationQueue)
                .to(orderExchange)
                .with(ORDER_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding orderStatusBinding(
            Queue notificationQueue,
            DirectExchange orderExchange) {

        return BindingBuilder
                .bind(notificationQueue)
                .to(orderExchange)
                .with(ORDER_STATUS_ROUTING_KEY);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}