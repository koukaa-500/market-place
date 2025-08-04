package tn.homrnai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.homrnai.dto.OrderRequestDTO;
import tn.homrnai.model.Order;
import tn.homrnai.model.User;
import tn.homrnai.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    // Create order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequestDTO orderRequestDTO, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        Order order = orderService.createOrder(userId, orderRequestDTO);
        return ResponseEntity.ok(order);
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Get order by id
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    // Delete order by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // Update order by id
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody OrderRequestDTO orderRequestDTO) {
        Order updatedOrder = orderService.updateOrder(id, orderRequestDTO);
        return ResponseEntity.ok(updatedOrder);
    }
    @GetMapping("/societe-orders")
    public ResponseEntity<List<Order>> getOrdersBySociete(Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();
        List<Order> orders = orderService.getOrdersByLoggedInUser(loggedInUser);
        return ResponseEntity.ok(orders);
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatusToTrue(@PathVariable Long id) {
        Order updatedOrder = orderService.updateOrderStatusToTrue(id);
        return ResponseEntity.ok(updatedOrder);
    }
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();
        List<Order> orders = orderService.getOrdersByUser(loggedInUser);
        return ResponseEntity.ok(orders);
    }
}
