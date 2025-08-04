import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { AuthServiceService } from 'src/app/AuthService/auth-service.service';
import { CartService } from 'src/app/CartService/cart.service'; // Import CartService
import { OrderService } from 'src/app/OrderService/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  cartSidebarVisible: boolean = false;
  timerMinutes: number = 5; 
  timerSeconds: number = 0;
  countdownInterval: any;
  loginRequest = { email: '', password: '' };
  userRole: string = ''; // Store the user's role

  constructor(
    private authService: AuthServiceService,
    private orderService: OrderService, 
    private router: Router,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    this.checkAndStartCountdown();
    const role = localStorage.getItem('userRole');
    this.userRole = role ? role : '';
  }

  get cartItems(): any[] {
    return this.cartService.getCartItems(); // Access cart items from CartService
  }

  checkAndStartCountdown(): void {
    if (this.cartItems.length > 0) {
      this.startCountdownTimer();
    } else {
      this.resetTimer();
    }
  }

  startCountdownTimer(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      if (this.timerMinutes === 0 && this.timerSeconds === 0) {
        clearInterval(this.countdownInterval);
        this.clearCart();
      } else {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
        } else {
          if (this.timerMinutes > 0) {
            this.timerMinutes--;
            this.timerSeconds = 59;
          }
        }
      }
    }, 1000);
  }

  resetTimer(): void {
    this.timerMinutes = 5;
    this.timerSeconds = 0;
    clearInterval(this.countdownInterval);
  }

  clearCart(): void {
    this.cartService.getCartItems().length = 0; // Clear cart items via CartService
    this.resetTimer();
  }

  isClientRole(): boolean {
    return this.authService.getRole() === 'CLIENT';
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.router.navigate(['/signin']);
  }

  toggleNavbar(): void {
    const navbarElement = this.navbarCollapse.nativeElement;
    const isCollapsed = navbarElement.classList.contains('collapse');
    if (isCollapsed) {
      navbarElement.classList.remove('collapse');
    } else {
      navbarElement.classList.add('collapse');
    }
  }

  toggleCartSidebar(): void {
    this.cartSidebarVisible = !this.cartSidebarVisible;
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index); // Use CartService method
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice(); // Use CartService method
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product); // Use CartService method
  }

  viewCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  updateQuantity(index: number, increment: boolean): void {
    this.cartService.updateQuantity(index, increment); // Use CartService method
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
    
          this.cartService.clearCart();

    
          const infoOrderModal = document.getElementById('infoOrder');
      if (infoOrderModal) {
        const modal = bootstrap.Modal.getInstance(infoOrderModal); // Get modal instance
        if (modal) {
          modal.hide(); // Hide the modal if it exists
        }
      }
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