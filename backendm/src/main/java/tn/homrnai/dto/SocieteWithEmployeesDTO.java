package tn.homrnai.dto;


import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import tn.homrnai.model.User;

import java.util.List;

@Data
@AllArgsConstructor
public class SocieteWithEmployeesDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String postalCode;
    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL, orphanRemoval = true)

    private List<User> employees; // List of employees under this Societe
}