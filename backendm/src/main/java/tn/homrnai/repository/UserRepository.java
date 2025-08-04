package tn.homrnai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.homrnai.model.User;
import tn.homrnai.model.role;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByEmail(String email);
        Optional<User> findByVerificationCode(String code);

        Optional<User> findByUsername(String username);
        List<User> findByRole(role role);
        // Fetch all employees with role SOCIETE_EMPLOYEE created by a specific SOCIETE
        @Query("SELECT u FROM User u WHERE u.role = :role AND u.societe.id = :societeId")
        List<User> findEmployeesBySociete(@Param("role") role role, @Param("societeId") Long societeId);

        List<User> findBySociete(User societe);

        boolean existsByEmail(String email);


}