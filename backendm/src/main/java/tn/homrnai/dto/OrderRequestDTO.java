package tn.homrnai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {
    private List<OrderItemDTO> items;
    private Double totalPrice;
    private String recipientName;
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String phoneNumber;
}
