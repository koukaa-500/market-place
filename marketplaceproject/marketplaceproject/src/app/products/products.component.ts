import { Component, OnInit } from '@angular/core';
import { ProductService } from '../servicesProduct/product.service';
import { Product } from '../servicesProduct/Product';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    typeP:'',
    imageUrls: [],
    quantity: 0,
    category: undefined,
    attributes: [],
    date_pub: new Date(),
    user: {
      id: 0,
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      role: '',
      active: false,
      image: '',
      registrationDate: null,
      verificationCode: '',
      verificationCodeExpiry: null,
      categories: [],
      employees:[],
      societe: null, // Set as null since it's optional
    }
  };
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    const societeId = 5;  // Replace with dynamic ID
    this.productService.getProductsSocieteEmpl(societeId).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  // Open the modal and load product data
  openEditProductModal(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.selectedProduct = product; // Set the selected product data
        // Ensure the modal element is found before passing it to the constructor
        const modalElement = document.getElementById('editProductModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement); // Pass the element directly
          modal.show();
        } else {
          console.error('Modal element not found');
        }
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      }
    });
  }

  // Handle the product update

// Handle the product update
updateProduct(): void {
  this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe({
    next: (updatedProduct) => {
      Swal.fire({
        title: 'Produit mis à jour',
        text: 'Les détails du produit ont été mis à jour avec succès.',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#08639c'
      }).then(() => {
        // Ensure the modal element is not null
        const modalElement = document.getElementById('editProductModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide(); // Hide the modal if the modal instance exists
          } else {
            console.error('Modal instance not found');
          }
        } else {
          console.error('Modal element not found');
        }

        // Reload the products list
        this.ngOnInit();  // Reload the products list
      });
    },
    error: (error) => {
      console.error('Error updating product:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour du produit.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  });
}

  

  // Delete product method (you already have this)
  deleteProduct(productId: number, event: Event): void {
    event.stopPropagation();
    
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
        this.productService.deleteProduct(productId).subscribe(
          () => {
            Swal.fire({
              title: 'Produit supprimé',
              text: 'Le produit a été supprimé avec succès.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#08639c'
            }).then(() => {
              window.location.reload();
            });
          },
          (error) => {
            console.error('Error deleting product:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Ce produit ne peut pas être supprimé car il est associé à des commandes existantes.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        );
      }
    });
  }
}
