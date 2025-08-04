package tn.homrnai.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.homrnai.model.Order;
import tn.homrnai.model.User;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN o.products p " +
            "WHERE p.user = :company " + // Products directly created by the company
            "   OR p.user.societe = :company") // Products created by employees of the company
    List<Order> findOrdersByCompany(@Param("company") User company);
    List<Order> findByUser(User user);
    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN TRUE ELSE FALSE END FROM Order o JOIN o.products p WHERE p.id = :productId")
    boolean existsByProductId(@Param("productId") Long productId);
}
