import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // Import Subject to notify changes

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  cartItemsUpdated = new Subject<void>(); // Subject to notify about cart changes

  constructor() {
    // Load cart from local storage on initialization
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  addToCart(product: any): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const productWithRequiredFields = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrls[0], // Assuming the first image URL is used
        quantity: 1,
      };
      this.cartItems.push(productWithRequiredFields);
    }
    this.saveCartToLocalStorage();
    this.cartItemsUpdated.next(); // Notify about the cart change
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveCartToLocalStorage();
    this.cartItemsUpdated.next(); // Notify about the cart change
  }

  updateQuantity(index: number, increment: boolean): void {
    if (increment) {
      this.cartItems[index].quantity++;
    } else if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
    this.saveCartToLocalStorage();
    this.cartItemsUpdated.next(); // Notify about the cart change
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cartItems');
    this.cartItemsUpdated.next(); // Notify about the cart change
  }
}
