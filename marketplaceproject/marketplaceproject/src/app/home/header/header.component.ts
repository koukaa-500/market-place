import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/UserService/User';
import { UserService } from 'src/app/UserService/user.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/servicesProduct/Product';
import { ProductService } from 'src/app/servicesProduct/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: User | null = null;  // Declare a user property to store user profile
  product: Product | null = null;
  isProductPage: boolean = false;  // Flag to check if we're on the product page
  isProductListPage: boolean = false;
  userRole: string = ''; // Store the user's role

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.checkIfProductPage();
    this.checkIfProductListPage();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.userRole = data.role;  // Assuming the user has a 'role' property
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);  // Handle errors
      }
    });
  }

  checkIfProductPage(): void {
    // Check if the current route is for a product page
    const productId = this.route.snapshot.paramMap.get('id');
    this.isProductPage = !!productId;  // If a product ID exists in the route, set flag to true
    if (this.isProductPage && productId) {
      this.getProductDetails(Number(productId));
    }
  }

  checkIfProductListPage(): void {
    this.isProductListPage = this.route.snapshot.routeConfig?.path === 'products';
  }

  getProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe(
      (data: Product) => {
        this.product = data;
      },
      (error: any) => {
        console.error('Error fetching product details:', error);
      }
    );
  }
}
