package tn.homrnai.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.homrnai.model.User;
import tn.homrnai.model.role;
import tn.homrnai.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Value("${image.upload.dir}")
    private String uploadDir;

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

public User updateUser(Long id, User updatedUser) {
    return userRepository.findById(id).map(user -> {
        // Only update non-null fields

        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getPhone() != null) {
            user.setPhone(updatedUser.getPhone());
        }

        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getActive() != null) {
            user.setActive(updatedUser.getActive());
        }

        if (updatedUser.getAddress() != null) {
            user.setAddress(updatedUser.getAddress());
        }
        if (updatedUser.getCity() != null) {
            user.setCity(updatedUser.getCity());
        }  if (updatedUser.getPostalCode() != null) {
            user.setPostalCode(updatedUser.getPostalCode());
        }

        if (updatedUser.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
            user.setPassword(encodedPassword);
        }
        if (updatedUser.getRole() != null) {
            user.setRole(updatedUser.getRole());
        }
        return userRepository.save(user);
    }).orElseThrow(() -> new RuntimeException("User not found"));
}


        @PostConstruct
    public void RegistredAdmin() {
        Optional<User> adminUser = userRepository.findByUsername("admin");
        if (adminUser == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setEmail("admin@gmail.com");

            admin.setActive(true);
            admin.setRole(role.ADMIN);


            userRepository.save(admin);
            System.out.println("Admin user created successfully.");
        } else {
            System.out.println("Admin user already exists.");
        }
    }
public User createNewUser(User newUser, User authenticatedUser) {
    if (authenticatedUser != null) {
        // Set the authenticated user as the creator or "societe"
        newUser.setSociete(authenticatedUser);

        // Encrypt password
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setAddress(newUser.getAddress());
        newUser.setPostalCode(newUser.getPostalCode());
        newUser.setRegistrationDate(LocalDateTime.now());
        // Set other fields, like active status or role if necessary
        newUser.setActive(true);  // Assuming the new user is active by default
        newUser.setRole(role.SOCIETE_EMPLOYEE);  // Assign a default role, or you can pass it in the request

        // Save the new user
        return userRepository.save(newUser);
    } else {
        throw new IllegalArgumentException("Authenticated user not found");
    }
}
    public List<User> getEmployeesBySociete(User societe) {
        return userRepository.findBySociete(societe);
    }
    public User updateUserImage(Long id, MultipartFile imageFile) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Save the file
            try {
                String fileName = saveImage(imageFile);
                user.setImage(fileName);  // Save image filename in database
                return userRepository.save(user);
            } catch (IOException e) {
                throw new RuntimeException("Could not save image: " + e.getMessage());
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private String saveImage(MultipartFile imageFile) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
        Path imagePath = Paths.get(uploadDir, fileName);

        Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}