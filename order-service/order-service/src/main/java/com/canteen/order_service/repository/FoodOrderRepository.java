package com.canteen.order_service.repository;

import com.canteen.order_service.entity.FoodOrder;
import com.canteen.order_service.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {

    List<FoodOrder> findByUserId(Long userId);

    List<FoodOrder> findByStatus(OrderStatus status);
}
