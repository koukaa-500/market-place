import { Component, OnInit } from '@angular/core';
import { OrderService } from '../OrderService/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-commandes',
  templateUrl: './my-commandes.component.html',
  styleUrls: ['./my-commandes.component.css']
})
export class MyCommandesComponent implements OnInit {
  orders: any[] = [];  // Array to store the orders
  currentPage: number = 1;  // Current page, starting at 1
  pageSize: number = 5;  // Number of items per page
  totalPages: number = 0;  // Total number of pages
  ordersToDisplay: any[] = [];  // Array to store orders to display on the current page

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  // Method to load orders for the logged-in user
  loadOrders(): void {
    this.orderService.getOrdersForUser().subscribe(
      (data) => {
        this.orders = data;  // Store the fetched orders
        this.totalPages = Math.ceil(this.orders.length / this.pageSize);  // Calculate the total number of pages
        this.updateOrdersForPage();
        console.log(this.orders);  // Log the orders (optional for debugging)
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  // Method to calculate orders to be displayed for the current page
  updateOrdersForPage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.ordersToDisplay = this.orders.slice(start, end);  // Slice orders to get the current page
  }

  // Method to go to the previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateOrdersForPage();
    }
  }

  // Method to go to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateOrdersForPage();
    }
  }
  deleteOrder(orderId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette commande sera supprimée définitivement.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(orderId).subscribe(() => {
          // Instead of manually filtering the order from the list, reload the orders
          this.loadOrders();  // Reload orders after deletion
          Swal.fire(
            'Supprimé!',
            'La commande a été supprimée.',
            'success'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          'La commande n\'a pas été supprimée.',
          'info'
        );
      }
    });
  }
}  
