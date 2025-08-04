package tn.homrnai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.homrnai.dto.OrderItemDTO;
import tn.homrnai.dto.OrderRequestDTO;
import tn.homrnai.model.Order;
import tn.homrnai.model.Product;
import tn.homrnai.model.User;
import tn.homrnai.model.role;
import tn.homrnai.repository.OrderRepository;
import tn.homrnai.repository.ProductRepository;
import tn.homrnai.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;


    public List<Order> getOrdersByLoggedInUser(User loggedInUser) {
        User company = (loggedInUser.getSociete() == null) ? loggedInUser : loggedInUser.getSociete();

        // Check permissions
        if (!hasPermissionToViewOrders(loggedInUser, company)) {
            throw new RuntimeException("You do not have permission to view these orders.");
        }

        return orderRepository.findOrdersByCompany(company);
    }

    private boolean hasPermissionToViewOrders(User loggedInUser, User company) {
        // If the user is the company itself, allow access
        if (loggedInUser.equals(company)) {
            return true;
        }

        // Check if the user is an employee of the company and has the ORDER_MANAGER role
        if (loggedInUser.getSociete() != null
                && loggedInUser.getSociete().equals(company)
                && loggedInUser.getRole() == role.ORDER_MANAGER) {
            return true;
        }

        // If neither condition is met, deny access
        return false;
    }
    // Create order
    @Transactional
    public Order createOrder(Long userId, OrderRequestDTO orderRequestDTO) {
        List<Long> productIds = orderRequestDTO.getItems().stream()
                .map(OrderItemDTO::getProductId)
                .collect(Collectors.toList());

        List<Product> products = productRepository.findAllById(productIds);

        // Check if all products were found
        if (products.size() != productIds.size()) {
            throw new RuntimeException("One or more products not found.");
        }

        Order order = new Order();
        order.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
        order.setTotalPrice(orderRequestDTO.getTotalPrice());
        order.setOrderDate(LocalDateTime.now());
        order.setProducts(products);

        // Set address information
        order.setRecipientName(orderRequestDTO.getRecipientName());
        order.setStreetAddress(orderRequestDTO.getStreetAddress());
        order.setCity(orderRequestDTO.getCity());
        order.setState(orderRequestDTO.getState());
        order.setPostalCode(orderRequestDTO.getPostalCode());
        order.setCountry(orderRequestDTO.getCountry());
        order.setPhoneNumber(orderRequestDTO.getPhoneNumber());
        order.setStatus(false);

        return orderRepository.save(order);
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get order by ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Delete order by ID
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(order);
    }

    // Update order by ID
    @Transactional
    public Order updateOrder(Long id, OrderRequestDTO orderRequestDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Update fields
        order.setRecipientName(orderRequestDTO.getRecipientName());
        order.setStreetAddress(orderRequestDTO.getStreetAddress());
        order.setCity(orderRequestDTO.getCity());
        order.setState(orderRequestDTO.getState());
        order.setPostalCode(orderRequestDTO.getPostalCode());
        order.setCountry(orderRequestDTO.getCountry());
        order.setPhoneNumber(orderRequestDTO.getPhoneNumber());
        order.setTotalPrice(orderRequestDTO.getTotalPrice());

        // Update products
        List<Product> products = productRepository.findAllById(orderRequestDTO.getItems().stream()
                .map(OrderItemDTO::getProductId)
                .collect(Collectors.toList()));
        order.setProducts(products);

        return orderRepository.save(order);
    }
    @Transactional
    public Order updateOrderStatusToTrue(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(true); // Update status to true
        return orderRepository.save(order); // Save updated order
    }
    public List<Order> getOrdersByUser(User loggedInUser) {
        return orderRepository.findByUser(loggedInUser); // Find orders by the logged-in user
    }
}
