package tn.homrnai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.homrnai.model.Product;
import tn.homrnai.model.User;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUser(User user);
    @Query("SELECT p FROM Product p WHERE p.user.id = :companyId " +
            "OR p.user.id IN (SELECT u.id FROM User u WHERE u.societe.id = :companyId)")
    List<Product> getProductsByCompanyId(Long companyId);
}
