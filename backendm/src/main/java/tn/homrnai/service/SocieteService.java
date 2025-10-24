package tn.homrnai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.homrnai.dto.SocieteWithEmployeesDTO;
import tn.homrnai.model.User;
import tn.homrnai.model.role;
import tn.homrnai.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SocieteService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<SocieteWithEmployeesDTO> getAllSocieteUsers() {
        List<User> societes = userRepository.findByRole(role.SOCIETE);

        return societes.stream().map(societe -> {
            List<User> employees = userRepository.findBySociete(societe);
            return new SocieteWithEmployeesDTO(
                    societe.getId(),
                    societe.getName(),
                    societe.getEmail(),
                    societe.getPhone(),
                    societe.getAddress(),
                    societe.getCity(),
                    societe.getPostalCode(),
                    employees
            );
        }).toList();
    }

    // Create a new SOCIETE user
    public User createSocieteUser(User societeUser) {
        // Validate required fields
        if (societeUser.getEmail() == null || societeUser.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        // Check if email already exists
        if (userRepository.findByEmail(societeUser.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Set SOCIETE role
        societeUser.setRole(role.SOCIETE);

        // Encode password
        societeUser.setPassword(passwordEncoder.encode(societeUser.getPassword()));

        // Set default values
        societeUser.setActive(true);
        societeUser.setRegistrationDate(LocalDateTime.now());

        // Save and return
        return userRepository.save(societeUser);
    }

    // Get a user with role SOCIETE by ID
    public User getSocieteUserById(Long id) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == role.SOCIETE)
                .orElse(null);
    }

    // Update an existing user with role SOCIETE
    public User updateSocieteUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .filter(user -> user.getRole() == role.SOCIETE)
                .orElseThrow(() -> new RuntimeException("User with ID " + id + " and role SOCIETE not found"));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setCity(updatedUser.getCity());
        existingUser.setPostalCode(updatedUser.getPostalCode());
        
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        
        return userRepository.save(existingUser);
    }

    // Delete a user with role SOCIETE
    public void deleteSocieteUser(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> u.getRole() == role.SOCIETE)
                .orElseThrow(() -> new RuntimeException("User with ID " + id + " and role SOCIETE not found"));

        // Disassociate products and employees
        user.getProducts().forEach(product -> product.setUser(null));
        userRepository.findBySociete(user).forEach(usr -> usr.setSociete(null));

        userRepository.delete(user);
    }

    // Get employees with role SOCIETE_EMPLOYEE for a specific SOCIETE
    public List<User> getSocieteEmployees(Long societeId) {
        return userRepository.findEmployeesBySociete(role.SOCIETE_EMPLOYEE, societeId);
    }

    public User updateUserActiveStatus(Long id, Boolean activeStatus) {
        User existingUser = userRepository.findById(id)
                .filter(user -> user.getRole() == role.SOCIETE)
                .orElseThrow(() -> new RuntimeException("User with ID " + id + " and role SOCIETE not found"));

        existingUser.setActive(activeStatus);
        return userRepository.save(existingUser);
    }
}