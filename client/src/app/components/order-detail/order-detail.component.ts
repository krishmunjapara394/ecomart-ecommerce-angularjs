import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
  providers: [OrderService],
})
export class OrderDetailComponent {
  selectedOrder: any = {};
  products: any = [];
  orderId: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private order: OrderService
  ) {
    this.orderId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.order.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order.order;
        this.products = order.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  cancelOrder(id: string) {
    this.order.deleteOrder(this.orderId).subscribe({
      next: () => {
        this.router.navigate(['/profile/orders']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
