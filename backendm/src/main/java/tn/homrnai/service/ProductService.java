package tn.homrnai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.homrnai.model.DynamicAttribute;
import tn.homrnai.model.Product;
import tn.homrnai.model.User;
import tn.homrnai.repository.DynamicAttributeRepository;
import tn.homrnai.repository.OrderRepository;
import tn.homrnai.repository.ProductRepository;
import tn.homrnai.repository.UserRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DynamicAttributeRepository dynamicAttributeRepository;

    @Value("${image.upload.dir}")
    private String imageUploadDir;

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(imageUploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        for (MultipartFile image : images) {
            if (image.isEmpty()) {
                continue;
            }
            
            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            
            // Create the file path using Path for cross-platform compatibility
            Path filePath = uploadPath.resolve(fileName);
            
            // Copy the file
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Store only the filename (Angular will construct the full path)
            imageUrls.add(fileName);
        }
        
        return imageUrls;
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
    }

    public Product getProductWithSociete(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        User creator = product.getUser();
        if (creator != null && creator.getSociete() != null) {
            User societe = userRepository.findById(creator.getSociete().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Societe not found for user."));
            creator.setSociete(societe);
        }

        return product;
    }

    public void addAttribute(Long productId, String key, String value) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        DynamicAttribute attribute = new DynamicAttribute();
        attribute.setKey(key);
        attribute.setValue(value);
        attribute.setProduct(product);

        dynamicAttributeRepository.save(attribute);
    }

    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        boolean isProductInOrders = orderRepository.existsByProductId(productId);
        if (isProductInOrders) {
            throw new IllegalArgumentException("Cannot delete product because it is associated with existing orders.");
        }

        dynamicAttributeRepository.deleteAll(product.getAttributes());

        // Delete image files
        if (product.getImageUrls() != null) {
            Path uploadPath = Paths.get(imageUploadDir);
            for (String imageUrl : product.getImageUrls()) {
                // Extract filename (handle both formats: with or without /assets/ prefix)
                String fileName = imageUrl;
                if (fileName.contains("/assets/")) {
                    fileName = fileName.substring(fileName.lastIndexOf("/assets/") + 8);
                } else if (fileName.startsWith("assets/")) {
                    fileName = fileName.substring(7);
                }
                
                Path filePath = uploadPath.resolve(fileName);
                
                try {
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    System.err.println("Failed to delete image: " + filePath + " - " + e.getMessage());
                    // Continue with deletion even if image file deletion fails
                }
            }
        }

        productRepository.delete(product);
    }

    public List<Product> getProductsByUser(User user) {
        return productRepository.findByUser(user);
    }

    public List<Product> getProductsByCompanyId(Long companyId) {
        return productRepository.getProductsByCompanyId(companyId);
    }
}