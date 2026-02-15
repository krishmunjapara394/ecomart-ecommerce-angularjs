import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [ProductService],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent implements OnInit {
  toggleBurgerMenu = false;
  categories: { name: string; count: number }[] = [];
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data.products;
        this.buildCategories();
      },
      error: (error) => {
        console.error('Failed to load products for navbar');
      },
    });
  }

  buildCategories() {
    const catMap = new Map<string, number>();
    this.products.forEach(p => {
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    });
    this.categories = Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  toggleMenu() {
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
  }

  goToCategory(category: string) {
    this.toggleBurgerMenu = false;
    this.router.navigate(['/catalog'], { queryParams: { category } });
  }

  goToCatalog() {
    this.toggleBurgerMenu = false;
    this.router.navigate(['/catalog']);
  }

  islogin() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  }
}
