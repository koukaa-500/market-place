package tn.homrnai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.homrnai.dto.SocieteWithEmployeesDTO;
import tn.homrnai.model.User;
import tn.homrnai.service.SocieteService;

import java.util.List;

@RestController
@RequestMapping("/api/societe")
@CrossOrigin(origins = "http://localhost:4200")
public class SocieteController {

    private final SocieteService societeService;

    @Autowired
    public SocieteController(SocieteService societeService) {
        this.societeService = societeService;
    }

    @GetMapping("/allusers")
    public ResponseEntity<List<SocieteWithEmployeesDTO>> getAllSocieteUsers() {
        List<SocieteWithEmployeesDTO> societeUsers = societeService.getAllSocieteUsers();
        return ResponseEntity.ok(societeUsers);
    }

    // Create a new SOCIETE user
    @PostMapping("/create")
    public ResponseEntity<User> createSocieteUser(@RequestBody User societeUser) {
        try {
            User createdUser = societeService.createSocieteUser(societeUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateSocieteUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = societeService.updateSocieteUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    // Get a specific user with role SOCIETE by ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getSocieteUserById(@PathVariable Long id) {
        User user = societeService.getSocieteUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("User with ID " + id + " and role SOCIETE not found"));
        }
        return ResponseEntity.ok(user);
    }

    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // Delete a user with role SOCIETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocieteUser(@PathVariable Long id) {
        societeService.deleteSocieteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Get all employees of a specific SOCIETE
    @GetMapping("/{societeId}/employees")
    public ResponseEntity<List<User>> getSocieteEmployees(@PathVariable Long societeId) {
        List<User> employees = societeService.getSocieteEmployees(societeId);
        return ResponseEntity.ok(employees);
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<User> updateUserActiveStatus(@PathVariable Long id, @RequestBody Boolean activeStatus) {
        User updatedUser = societeService.updateUserActiveStatus(id, activeStatus);
        return ResponseEntity.ok(updatedUser);
    }
}