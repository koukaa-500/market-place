import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../servicesProduct/Product';
import { ProductService } from '../servicesProduct/product.service';
import { AuthServiceService } from '../AuthService/auth-service.service';
import { NavbarComponent } from '../home/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 0;
  filteredProducts: Product[] = [];
  productTypes: string[] = [];  // Hold the unique types of products
  selectedType: string = 'Tous';  // Default to 'All' type for unfiltered list
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  constructor(
    private productService: ProductService,
    private authService: AuthServiceService,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getProducts(): void {
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.products = data.sort((a, b) => new Date(a.date_pub).getTime() - new Date(b.date_pub).getTime());
        this.totalPages = Math.ceil(this.products.length / this.pageSize);
        this.updatePaginatedProducts();
        this.extractProductTypes();  // Extract types when products are loaded
        this.filterProducts();
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  extractProductTypes(): void {
    const types = this.products.map(product => product.typeP);
    this.productTypes = ['Tous', ...new Set(types)];  // Get unique types, and include 'All'
  }

  addToCart(product: any, event: MouseEvent): void {
    event.stopPropagation();
    this.navbarComponent.addToCart(product);
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Filter products based on typeP and date_pub
  filterProducts(): void {
    const currentDate = new Date();

    this.filteredProducts = this.paginatedProducts
      .sort((a, b) => new Date(b.date_pub).getTime() - new Date(a.date_pub).getTime())
      .filter(product => {
        const productDate = new Date(product.date_pub);
        const matchesType = this.selectedType === 'Tous' || product.typeP === this.selectedType;
        return productDate <= currentDate && matchesType;
      });
  }

  // Delete product method as before
  deleteProduct(productId: number, event: Event): void {
    event.stopPropagation();

    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      confirmButtonColor: '#08639c',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the deletion if confirmed
        this.productService.deleteProduct(productId).subscribe(
          () => {
            // Show success message after deletion
            Swal.fire({
              title: 'Produit supprimé',
              text: 'Le produit a été supprimé avec succès.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#08639c'
            }).then(() => {
              // Refresh the page after deletion
              window.location.reload(); // Reload the page
            });
          },
          (error: any) => {
            // Handle error during deletion
            console.error('Error deleting product:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression du produit. Veuillez réessayer.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        );
      } else {
        // If canceled, show a message or do nothing
        console.log('Suppression annulée');
      }
    });
  }
}
