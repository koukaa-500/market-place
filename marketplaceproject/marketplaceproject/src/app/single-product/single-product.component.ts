import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../servicesProduct/Product';
import { ProductService } from '../servicesProduct/product.service';
import { CartService } from '../CartService/cart.service';
import { NavbarComponent } from '../home/navbar/navbar.component';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  product: Product | null = null;
  currentImageIndex: number = 0;
  quantity: number = 1;
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.getProductDetails(Number(productId));
    }
  }

  getProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe(
      (data: Product) => {
        this.product = data;
        this.currentImageIndex = 0; 
      },
      (error: any) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  // Navigate to the previous image
  previousImage(): void {
    if (this.product && this.product.imageUrls) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
    }
  }

  // Navigate to the next image
  nextImage(): void {
    if (this.product && this.product.imageUrls) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imageUrls.length;
    }
  }
  increaseQuantity(): void {
    if (this.quantity < 10) {  // Check if it's less than the max quantity
      this.quantity++;
    }
  }

  // Method to decrease the quantity
  decreaseQuantity(): void {
    if (this.quantity > 0) {  // Ensure it doesn't go below the minimum
      this.quantity--;
    }
  }
  addToCart(product: any, event: MouseEvent): void {
    event.stopPropagation();
    this.navbarComponent.addToCart(product); 
  }
}
