package tn.homrnai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.homrnai.model.DynamicAttribute;

public interface DynamicAttributeRepository extends JpaRepository<DynamicAttribute, Long> {
}