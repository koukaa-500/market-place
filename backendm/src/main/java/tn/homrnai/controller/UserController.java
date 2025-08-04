package tn.homrnai.controller;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.homrnai.model.User;
import tn.homrnai.model.role;
import tn.homrnai.repository.UserRepository;
import tn.homrnai.service.UserService;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal User userdetails) {
        if (userdetails != null) {
            String email = userdetails.getEmail();
            Optional<User> user = userRepository.findByEmail(email);
            return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PutMapping(value = "/{id}/update-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateUserImage(@PathVariable Long id, @RequestParam("image") MultipartFile imageFile) {
        try {
            User updatedUser = userService.updateUserImage(id, imageFile);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PostConstruct
    public void createAdmin(){
        userService.RegistredAdmin();
    }
@PostMapping("/create")
public ResponseEntity<User> createUser(@RequestBody User newUser, @AuthenticationPrincipal User authenticatedUser) {
    try {
        // Create the new user and set the "societe" ID based on the authenticated user
        User createdUser = userService.createNewUser(newUser, authenticatedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}
    @GetMapping("/employees")
    public ResponseEntity<List<User>> getEmployeesForSociete(@AuthenticationPrincipal User authenticatedUser) {
        if (authenticatedUser != null && authenticatedUser.getRole() == role.SOCIETE) {
            List<User> employees = userService.getEmployeesBySociete(authenticatedUser);
            return ResponseEntity.ok(employees);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();  // Return forbidden if not Societe
    }

}