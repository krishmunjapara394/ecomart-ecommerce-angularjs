import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { OrderService } from '../../services/order/order.service';
import { ProductService } from '../../services/product/product.service';
import { UserServiceService } from '../../services/user/user-service.service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  providers: [ProfileService, OrderService, UserServiceService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  users: any[] = [];
  labels: string[] = [];
  data: number[] = [];
  orders: any[] = [];
  products: any[] = [];

  // Stats
  totalUsers = 0;
  totalOrders = 0;
  totalProducts = 0;
  totalRevenue = 0;

  // Quick stats
  pendingOrders = 0;
  acceptedOrders = 0;
  rejectedOrders = 0;

  constructor(
    private profileService: ProfileService,
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.getUsersCharts();
    this.getChartsMyOrders();
    this.getChartsProducts();
    this.loadStats();
  }

  loadStats(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.totalUsers = response.data?.length || 0;
      },
      error: () => {},
    });

    this.orderService.getOrders().subscribe({
      next: (response: any) => {
        this.totalOrders = response.pagination?.totalOrders || 0;
        const orders = response.orders || [];
        this.totalRevenue = orders.reduce(
          (sum: number, o: any) => sum + (o.totalPrice || 0),
          0
        );
      },
      error: () => {},
    });

    this.productService.getAllProducts(1, 1).subscribe({
      next: (response: any) => {
        this.totalProducts = response.totalProducts?.length || response.totalProducts || 0;
      },
      error: () => {},
    });
  }

  // User chart
  UserChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        display: true,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
    },
  };

  UserChartData: ChartData<'line'> = {
    labels: this.labels,
    datasets: [
      {
        data: this.data,
        label: 'User Count',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  getUsersCharts() {
    this.profileService.getUsersCharts().subscribe((data: any) => {
      this.users = data.data;
      this.labels = this.users.map((user) => user.date);
      this.data = this.users.map((user) => user.count);
      this.UserChartData = {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            label: 'Users Registered',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: '#10b981',
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#10b981',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2,
          },
        ],
      };
    });
  }

  // Orders chart
  OrderChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          padding: 16,
          font: { size: 12, weight: 500 },
          color: '#64748b',
        },
      },
    },
  };

  countsOrders = this.orders.map((item) => item.count);
  statusOrders = this.orders.map((item) => item.status);
  OrdersChartData = {
    labels: this.statusOrders,
    datasets: [
      {
        data: this.countsOrders,
        label: 'Orders',
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  getChartsMyOrders() {
    this.orderService.getChartsMyOrders().subscribe((data: any) => {
      this.orders = data;
      this.countsOrders = this.orders.map((order) => order.count);
      this.statusOrders = this.orders.map((order) => order.status);

      this.pendingOrders = 0;
      this.acceptedOrders = 0;
      this.rejectedOrders = 0;
      this.orders.forEach((o) => {
        if (o.status === 'pending') this.pendingOrders = o.count;
        else if (o.status === 'accepted') this.acceptedOrders = o.count;
        else if (o.status === 'rejected') this.rejectedOrders = o.count;
      });

      this.OrdersChartData = {
        labels: this.statusOrders,
        datasets: [
          {
            data: this.countsOrders,
            label: 'Orders',
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      };
    });
  }

  // Products chart
  productChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#334155', font: { size: 12, weight: 500 } },
      },
    },
  };

  countsProducts = this.products.map((item) => item.count);
  brandProducts = this.products.map((item) => item.brand);
  ProductsChartData = {
    labels: this.brandProducts,
    datasets: [
      {
        data: this.countsProducts,
        label: 'Products',
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(6, 182, 212, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  getChartsProducts() {
    this.productService.getChartsProducts().subscribe((data: any) => {
      this.products = data;
      this.countsProducts = this.products.map((product) => product.count);
      this.brandProducts = this.products.map((product) => product.brand);
      this.ProductsChartData = {
        labels: this.brandProducts,
        datasets: [
          {
            data: this.countsProducts,
            label: 'Products',
            backgroundColor: [
              'rgba(16, 185, 129, 0.7)',
              'rgba(6, 182, 212, 0.7)',
              'rgba(99, 102, 241, 0.7)',
              'rgba(245, 158, 11, 0.7)',
            ],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      };
    });
  }
}
