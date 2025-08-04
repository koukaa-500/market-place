import { Component, OnInit } from '@angular/core';
import { OrderService } from '../OrderService/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  paginatedOrders: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  searchText: string = '';
  selectedStatus: string = '';
  selectedDate: string = '';
  orderStatuses = [true, false];  // Completed and In Progress

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  toggleOrderStatus(order: any): void {
    const currentStatus = order.status;

    // Call the updateOrderStatus method in the service
    this.orderService.updateOrderStatus(order.id).subscribe({
      next: () => {
        // Update the status in the UI
        order.status = !currentStatus;

        // Display a success message
        Swal.fire({
          icon: 'success',
          title: 'Statut mis à jour',
          text: `La commande est maintenant ${order.status ? 'Complétée' : 'En cours'}.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error updating order status:', error);

        // Display an error message
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de mettre à jour le statut. Veuillez réessayer.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
  loadOrders(): void {
    this.orderService.getOrdersBySociete().subscribe({
      next: (data) => {
        this.orders = data;
        this.totalPages = Math.ceil(this.orders.length / this.pageSize);
        this.updatePaginatedOrders();
      },
      error: (error) => {
        console.error('Error fetching orders by société:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les commandes. Veuillez réessayer plus tard.',
          timer: 2000,
          showConfirmButton: false,
        });
      },
    });
  }
  applyFilters(): void {
    // Start with the original list of orders (unchanged)
    let filteredOrders = [...this.orders];
  
    // Filter by search text (case insensitive)
    if (this.searchText) {
      const lowerSearchText = this.searchText.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.recipientName.toLowerCase().includes(lowerSearchText) || // Use the actual field name
        String(order.id).toLowerCase().includes(lowerSearchText) // Allow filtering by ID
      );
    }
  
    // Filter by status
    if (this.selectedStatus) {
      const statusFilter = this.selectedStatus === 'true'; // Convert string to boolean
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
  
    // Filter by date
    if (this.selectedDate) {
      const selectedDateObj = new Date(this.selectedDate);
      filteredOrders = filteredOrders.filter(order => {
        const orderDateObj = new Date(order.orderDate); // Use the actual date field
        return (
          orderDateObj.getFullYear() === selectedDateObj.getFullYear() &&
          orderDateObj.getMonth() === selectedDateObj.getMonth() &&
          orderDateObj.getDate() === selectedDateObj.getDate()
        );
      });
    }
  
    // Update the paginated orders with the filtered list
    this.totalPages = Math.ceil(filteredOrders.length / this.pageSize);
    this.currentPage = 1;
    this.paginatedOrders = filteredOrders.slice(0, this.pageSize);
  }
  

  // Update the list of orders based on the current page
  updatePaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);
  }

  openUpdatePopup(order: any): void {
    // Implement logic to open the update popup
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
          this.orders = this.orders.filter(order => order.id !== orderId);
          this.totalPages = Math.ceil(this.orders.length / this.pageSize);
          this.updatePaginatedOrders();
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

  // Pagination Methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrders();
    }
  }
}
