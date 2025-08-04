package tn.homrnai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SocieteRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String address;
    private String phone;
    private List<Long> categoryIds;
    private String city; // New field for city
    private String postalCode; // New field for postal code
}
