package tn.homrnai.service;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Role;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.homrnai.config.JwtService;
import tn.homrnai.dto.AuthenticationRequest;
import tn.homrnai.dto.AuthenticationResponse;
import tn.homrnai.dto.RegisterRequest;
import tn.homrnai.dto.SocieteRegisterRequest;
import tn.homrnai.model.Category;
import tn.homrnai.model.User;
import tn.homrnai.model.role;
import tn.homrnai.repository.CategoryRepository;
import tn.homrnai.repository.UserRepository;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EmailService emailService;

    private static final int VERIFICATION_CODE_EXPIRY_MINUTES = 15;
    @Autowired
    private CategoryRepository categoryRepository;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        // Generate a 6-digit activation code
        String verificationCode = generateActivationCode(6);
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES);

        // Build and save the user
        var user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .active(false)
                .role(role.CLIENT)
                .verificationCode(verificationCode)
                .verificationCodeExpiry(expiryTime)
                .build();

        userRepository.save(user);

        // Prepare the confirmation URL (if needed for email template)
        String confirmationUrl = String.format("http://localhost:8080/v1/auth/verify?code=%s", verificationCode);

        try {
            emailService.sendEmail(
                    registerRequest.getEmail(),
                    registerRequest.getUsername(),
                    EmailTemplateName.ACTIVATE_ACCOUNT,
                    confirmationUrl,
                    verificationCode,
                    "Account Activation"
            );

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send activation email", e);
        }

        // Return success response
        return AuthenticationResponse.builder()
                .message("Registration successful. Please check your email for the activation code.")
                .build();
    }

    public AuthenticationResponse registerSociete(SocieteRegisterRequest societeRequest) {
        try {
            // Validate if the email is already in use
            if (userRepository.existsByEmail(societeRequest.getEmail())) {
                return AuthenticationResponse.builder()
                        .message("A Societe with this email already exists. Please use a different email.")
                        .build();
            }

            // Find the categories by IDs
            List<Category> categories = societeRequest.getCategoryIds().stream()
                    .map(categoryId -> categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + categoryId)))
                    .toList();

            // Build and save the user with multiple addresses and associated categories
            var user = User.builder()
                    .name(societeRequest.getName())
                    .email(societeRequest.getEmail())
                    .password(passwordEncoder.encode(societeRequest.getPassword()))
                    .address(societeRequest.getAddress())
                    .phone(societeRequest.getPhone())
                    .city(societeRequest.getCity()) // Add city
                    .postalCode(societeRequest.getPostalCode()) // Add postal code
                    .registrationDate(LocalDateTime.now())
                    .categories(categories)
                    .active(false)
                    .role(role.SOCIETE)
                    .build();

            userRepository.save(user);

            return AuthenticationResponse.builder()
                    .message("Societe registration successful. Please wait for admin approval.")
                    .build();
        } catch (IllegalArgumentException e) {
            // Handle invalid category IDs
            return AuthenticationResponse.builder()
                    .message("Error during registration: " + e.getMessage())
                    .build();
        } catch (DataIntegrityViolationException e) {
            // Handle database constraint violations (e.g., duplicate entries)
            return AuthenticationResponse.builder()
                    .message("Error during registration: Email or other data conflicts with existing records.")
                    .build();
        } catch (Exception e) {
            // Handle general errors (e.g., server issues)
            return AuthenticationResponse.builder()
                    .message("An unexpected error occurred. Please try again later.")
                    .build();
        }
    }


    public void verifyAccount(String code) {
        System.out.println("Received activation code: " + code);

        // Find user by verification code
        User user = userRepository.findByVerificationCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid activation code"));

        System.out.println("User found: " + user);

        // Check if the activation code has expired
        if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("Activation code expired for user: " + user.getEmail());
            throw new IllegalArgumentException("Activation code expired");
        }

        // Activate the user and clear the verification code
        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);

        System.out.println("User activated successfully: " + user.getEmail());
    }



    private String generateActivationCode(int length) {
        String characters = "0123456789";
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder codeBuilder = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        if (!user.getActive()) {
            throw new RuntimeException("Account is not activated");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid password");
        }

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .message("Authentication successful")
                .role(user.getRole().toString())
                .build();

    }

}