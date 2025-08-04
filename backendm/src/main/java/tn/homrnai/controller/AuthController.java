package tn.homrnai.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.homrnai.dto.AuthenticationRequest;
import tn.homrnai.dto.AuthenticationResponse;
import tn.homrnai.dto.RegisterRequest;

import tn.homrnai.dto.SocieteRegisterRequest;
import tn.homrnai.service.AuthService;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@CrossOrigin(origins = "http://localhost:4200")

public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest registerRequest
    ) {
        AuthenticationResponse authResponse = authService.register(registerRequest);
        return ResponseEntity.ok(authResponse);
    }
    @PostMapping("/register-societe")
    public ResponseEntity<AuthenticationResponse> registerSociete(
            @RequestBody SocieteRegisterRequest societeRequest
    ) {
        AuthenticationResponse authResponse = authService.registerSociete(societeRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        try {
            AuthenticationResponse authResponse = authService.authenticate(request);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam("code") String code) {
        try {
            authService.verifyAccount(code); // Validate and activate user
            return ResponseEntity.ok(Map.of("message", "Activation successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred"));
        }
    }


}