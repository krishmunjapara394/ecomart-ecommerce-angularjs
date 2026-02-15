import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  providers: [ProductService],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  trendingProducts: Product[] = [];
  newArrivals: Product[] = [];
  bestSellers: Product[] = [];
  dealProducts: Product[] = [];
  categories: { name: string; count: number; image: string }[] = [];
  brands: { name: string; count: number }[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data.products || data;
        this.buildHomeData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading products:", error);
        this.isLoading = false;
      }
    });
  }

  buildHomeData() {
    // Trending: top 8 products (shuffled)
    const shuffled = [...this.products].sort(() => Math.random() - 0.5);
    this.trendingProducts = shuffled.slice(0, 8);

    // New arrivals: last 4 products
    this.newArrivals = this.products.slice(-4).reverse();

    // Best sellers: random 4 different from trending
    this.bestSellers = shuffled.slice(8, 12);

    // Deal products: 3 random picks for flash deals
    this.dealProducts = shuffled.slice(12, 15);

    // Categories with counts and first product image
    const catMap = new Map<string, { count: number; image: string }>();
    this.products.forEach(p => {
      if (!catMap.has(p.category)) {
        catMap.set(p.category, { count: 1, image: p.images?.[0] || '' });
      } else {
        catMap.get(p.category)!.count++;
      }
    });
    this.categories = Array.from(catMap.entries())
      .map(([name, data]) => ({ name, count: data.count, image: data.image }))
      .sort((a, b) => b.count - a.count);

    // Brands
    const brandMap = new Map<string, number>();
    this.products.forEach(p => {
      brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
    });
    this.brands = Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  goToCategory(category: string) {
    this.router.navigate(['/catalog'], { queryParams: { category } });
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }
}
