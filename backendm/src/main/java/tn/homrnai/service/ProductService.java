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
        for (MultipartFile image : images) {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            File file = new File(imageUploadDir, fileName);
            Files.copy(image.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
            imageUrls.add("/assets/" + fileName);
        }
        return imageUrls;
    }
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
    }

    public Product getProductWithSociete(Long productId) {
        // Fetch product by ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Fetch user (creator of the product)
        User creator = product.getUser();
        if (creator != null && creator.getSociete() != null) {
            // Fetch and set societe information
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
        // Find the product by its ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Check if the product is part of any order
        boolean isProductInOrders = orderRepository.existsByProductId(productId);
        if (isProductInOrders) {
            throw new IllegalArgumentException("Cannot delete product because it is associated with existing orders.");
        }

        // Delete associated attributes
        dynamicAttributeRepository.deleteAll(product.getAttributes());

        // Delete image files
        if (product.getImageUrls() != null) {
            for (String imageUrl : product.getImageUrls()) {
                String filePath = imageUploadDir + imageUrl.replace("/assets/", "");
                try {
                    Files.deleteIfExists(Paths.get(filePath));
                } catch (IOException e) {
                    throw new RuntimeException("Failed to delete image: " + filePath, e);
                }
            }
        }

        // Delete the product from the database
        productRepository.delete(product);
    }
    public List<Product> getProductsByUser(User user) {
        return productRepository.findByUser(user);
    }
    public List<Product> getProductsByCompanyId(Long companyId) {
        return productRepository.getProductsByCompanyId(companyId);
    }
}