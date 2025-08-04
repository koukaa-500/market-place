package tn.homrnai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.homrnai.model.DynamicAttribute;
import tn.homrnai.model.Product;
import tn.homrnai.model.User;
import tn.homrnai.repository.ProductRepository;
import tn.homrnai.service.ProductService;


import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;


    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    @PreAuthorize("hasAuthority('MANAGE_PRODUCTS')")

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<?> createProduct(@RequestParam("name") String name,
                                           @RequestParam("description") String description,
                                           @RequestParam("typeP") String typeP,
                                           @RequestParam("price") double price,
                                           @RequestParam("quantity") int quantity,
                                           @RequestParam("images") List<MultipartFile> images,
                                           @RequestParam("attributes") String attributesJson) {
        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();


            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setTypeP(typeP);
            product.setPrice(price);
            product.setQuantity(quantity);
            product.setUser(user);
            product.setDate_pub(new Date());

            List<String> imageUrls = productService.saveImages(images);
            product.setImageUrls(imageUrls);

            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, String>> attributes = objectMapper.readValue(attributesJson, List.class);
            attributes.forEach(attributeMap -> {
                DynamicAttribute dynamicAttribute = new DynamicAttribute();
                dynamicAttribute.setKey(attributeMap.get("key"));
                dynamicAttribute.setValue(attributeMap.get("value"));
                dynamicAttribute.setProduct(product);
                product.getAttributes().add(dynamicAttribute);
            });


            Product savedProduct = productService.saveProduct(product);

            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductWithSociete(id);
        return ResponseEntity.ok(product);
    }


    @PostMapping("/{id}/attributes")
    public void addAttribute(Long productId, String key, String value) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        DynamicAttribute attribute = new DynamicAttribute();
        attribute.setKey(key);
        attribute.setValue(value);
        attribute.setProduct(product);
        product.getAttributes().add(attribute);

        productRepository.save(product);
    }


    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getProductsForAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        List<Product> userProducts = productService.getProductsByUser(user);
        return ResponseEntity.ok(userProducts);
    }
    @GetMapping("/products-societe/{companyId}")
    public ResponseEntity<List<Product>> getProductsForCompany(@PathVariable Long companyId) {
        List<Product> products = productService.getProductsByCompanyId(companyId);
        return ResponseEntity.ok(products);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            // Find the product to update by its ID
            Product product = productService.getProductById(id);

            // Update product details
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setTypeP(productDetails.getTypeP());
            product.setPrice(productDetails.getPrice());
            product.setQuantity(productDetails.getQuantity());
            product.setDate_pub(new Date());  // Optionally update the publish date

            // If image URLs are provided, just update the list of image URLs
            if (productDetails.getImageUrls() != null && !productDetails.getImageUrls().isEmpty()) {
                product.setImageUrls(productDetails.getImageUrls());
            }

            // Update dynamic attributes if any
            if (productDetails.getAttributes() != null && !productDetails.getAttributes().isEmpty()) {
                product.getAttributes().clear();
                for (DynamicAttribute attribute : productDetails.getAttributes()) {
                    attribute.setProduct(product);
                    product.getAttributes().add(attribute);
                }
            }

            // Save updated product
            Product updatedProduct = productService.saveProduct(product);

            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }


}