import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile/profile.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  providers: [ProfileService],
})
export class AdminDashboardComponent implements OnInit {
  sidebarCollapsed = false;
  mobileSidebarOpen = false;
  currentRoute = '';
  adminInfo: any = {
    fullName: 'Admin',
    email: 'admin@ecomart.com',
    image: '',
  };
  currentDate = new Date();
  showProfileDropdown = false;

  navSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', route: '/admin-dashboard/overview', icon: 'dashboard' },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Users', route: '/admin-dashboard/accounts-overview', icon: 'people' },
        { label: 'Products', route: '/admin-dashboard/products-overview', icon: 'inventory_2' },
        { label: 'Orders', route: '/admin-dashboard/orders-overview', icon: 'local_shipping' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'My Profile', route: '/admin-dashboard/profile', icon: 'account_circle' },
        { label: 'Settings', route: '/admin-dashboard/settings', icon: 'settings' },
      ],
    },
  ];

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadAdminProfile();
    this.currentRoute = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects || event.url;
        this.mobileSidebarOpen = false;
      });
  }

  loadAdminProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        this.adminInfo = response.user || response;
        if (this.adminInfo.image && !this.adminInfo.image.includes('http')) {
          this.adminInfo.image = 'data:image/png;base64,' + this.adminInfo.image;
        }
      },
      error: () => {},
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  getPageTitle(): string {
    const routeMap: { [key: string]: string } = {
      '/admin-dashboard/overview': 'Dashboard Overview',
      '/admin-dashboard/accounts-overview': 'User Management',
      '/admin-dashboard/products-overview': 'Product Management',
      '/admin-dashboard/orders-overview': 'Order Management',
      '/admin-dashboard/profile': 'Admin Profile',
      '/admin-dashboard/settings': 'Settings',
    };
    return routeMap[this.currentRoute] || 'Dashboard';
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/home';
  }
}
