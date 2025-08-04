package tn.homrnai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.homrnai.model.Avis;

import java.util.List;

@Repository

public interface AvisRepository  extends JpaRepository<Avis, Long> {
    List<Avis> findByProductId(Long productId);

}
