import { Component, OnInit } from '@angular/core';
import { CartService } from '../CartService/cart.service';
import { OrderService } from '../OrderService/order.service';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../AuthService/auth-service.service';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems: any[] = [];
  totalPrice: number = 0;
  loginRequest = { email: '', password: '' };

  constructor(private cartService: CartService, private orderService: OrderService, 
    private authService: AuthServiceService, private router: Router) {
      
    }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
    this.refreshCart();
  }

  updateQuantity(index: number, increment: boolean): void {
    this.cartService.updateQuantity(index, increment);
    this.refreshCart();
  }

  private refreshCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartService.clearCart();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.getSubtotal(); 
  }

  openPopup(): void {
    // Check if the user is logged in using the authService
    if (!this.authService.isLoggedIn()) {
      // Display the sign-in modal
      const signInModal = document.getElementById('signInModal');
      if (signInModal) {
        const modal = new bootstrap.Modal(signInModal); // Bootstrap modal instance
        modal.show();
      }
      return; // Exit the method if user is not logged in
    } else {
      // Display the info order modal
      const infoOrder = document.getElementById('infoOrder');
      if (infoOrder) {
        const modal = new bootstrap.Modal(infoOrder); // Bootstrap modal instance
        modal.show();
      }
      return; // Exit the method after showing the modal
    }
  }
  
  submitOrder(orderFormData: any): void {
    // Retrieve additional user info from localStorage
    const recipientName = orderFormData.recipientName;
    const streetAddress = orderFormData.streetAddress;
    const city = orderFormData.city;
    const state = orderFormData.state;
    const postalCode = orderFormData.postalCode;
    const country = orderFormData.country;
    const phoneNumber = orderFormData.phoneNumber;

    // Create the order payload
    const order = {
      items: this.cartItems.map((item) => ({
        productId: item.id, 
        quantity: item.quantity,
      })),
      totalPrice: this.getTotalPrice(),
      recipientName: recipientName,
      streetAddress: streetAddress,
      city: city,
      state: state,
      postalCode: postalCode,
      country: country,
      phoneNumber: phoneNumber,
    };

    // Call the createOrder method from the service
    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès !',
          text: 'Votre commande a été passée avec succès !',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.clearCart(); 
      },
      error: (error) => {
          console.error('Erreur lors de la commande', error);
          Swal.fire({
            title: 'Erreur !',
            text: 'Échec de la commande. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
      },
    });
  }
  login(): void {
    if (!this.loginRequest.email || !this.loginRequest.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs requis.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
      });
      return;
    }
  
    this.authService.authenticate(this.loginRequest).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie !',
          text: 'Vous êtes connecté(e), vous pouvez maintenant passer à la caisse.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#08639c'
        }).then(() => {
          this.router.navigate(['/shopping-cart']);
        });
      },
      error => {
        if (error.error && error.error.includes('Email not found')) {
          Swal.fire({
            icon: 'error',
            title: 'Email non trouvé',
            text: 'Veuillez vérifier votre email et réessayer.',
            confirmButtonText: 'Réessayer',
            confirmButtonColor: '#08639c'
          });
        } else if (error.error && error.error.includes('Invalid password')) {
          Swal.fire({
            icon: 'error',
            title: 'Mot de passe incorrect',
            text: 'Veuillez vérifier votre mot de passe et réessayer.',
            confirmButtonText: 'Réessayer',
            confirmButtonColor: '#08639c'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Échec de la connexion',
            text: 'Veuillez vérifier votre email et mot de passe et réessayer.',
            confirmButtonText: 'Réessayer',
            confirmButtonColor: '#08639c'
          });
        }
      }
    );
  }
  
  oauth2Login(provider: string): void {
    this.authService.oauth2Login(provider);
  }
}
