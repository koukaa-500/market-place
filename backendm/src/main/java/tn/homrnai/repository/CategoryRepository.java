package tn.homrnai.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.homrnai.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}