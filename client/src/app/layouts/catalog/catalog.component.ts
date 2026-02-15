import { Component } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, LoadingSpinnerComponent, RouterModule, FormsModule],
  templateUrl: './catalog.component.html',
  providers: [ProductService],
  styles: ``
})
export class CatalogComponent {

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  products: Product[] = [];
  checksCategory: string[] = [];
  checksBrand: string[] = [];
  filteredProducts: Product[] = [];
  minPrice = 0;
  maxPrice = 0;
  colors = new Set<string>();
  sortToggle = false;
  viewMode: 'grid' | 'list' = 'grid';
  isLoading = true;

  // Dynamic lists derived from product data
  availableCategories: { name: string; count: number }[] = [];
  availableBrands: { name: string; count: number }[] = [];
  availableColors: string[] = [];
  priceRange = { min: 0, max: 0 };
  sliderMin = 0;
  sliderMax = 0;

  // Mobile filter toggle
  showMobileFilters = false;

  // Collapsible sections
  expandedSections: { [key: string]: boolean } = {
    categories: true,
    brands: true,
    price: true,
    colors: true
  };

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data.products;
        this.filteredProducts = this.products;
        this.isLoading = false;
        this.buildFilterData();

        // Auto-apply category from query params (from header dropdown)
        this.route.queryParams.subscribe(params => {
          if (params['category']) {
            this.checksCategory = [params['category']];
            this.filter();
          }
        });
      },
      error: (error) => {
        console.error("404 Not Found");
        this.isLoading = false;
      }
    })
  }

  buildFilterData() {
    // Extract unique categories with counts
    const catMap = new Map<string, number>();
    const brandMap = new Map<string, number>();
    const colorSet = new Set<string>();
    let minP = Infinity, maxP = 0;

    this.products.forEach(p => {
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
      if (p.colors) p.colors.forEach(c => colorSet.add(c));
      if (p.price < minP) minP = p.price;
      if (p.price > maxP) maxP = p.price;
    });

    this.availableCategories = Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.availableBrands = Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.availableColors = Array.from(colorSet);
    this.priceRange = { min: minP === Infinity ? 0 : minP, max: maxP };
    this.sliderMin = this.priceRange.min;
    this.sliderMax = this.priceRange.max;
  }

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  getCategoriesFilters(category: string) {
    const idx = this.checksCategory.indexOf(category);
    if (idx > -1) {
      this.checksCategory.splice(idx, 1);
    } else {
      this.checksCategory.push(category);
    }
    this.filter();
  }

  getBrandsFilters(brand: string) {
    const idx = this.checksBrand.indexOf(brand);
    if (idx > -1) {
      this.checksBrand.splice(idx, 1);
    } else {
      this.checksBrand.push(brand);
    }
    this.filter();
  }

  onSliderMinChange(event: any) {
    let val = +event.target.value;
    if (val > this.sliderMax) val = this.sliderMax;
    this.sliderMin = val;
    this.minPrice = val;
    this.filter();
  }

  onSliderMaxChange(event: any) {
    let val = +event.target.value;
    if (val < this.sliderMin) val = this.sliderMin;
    this.sliderMax = val;
    this.maxPrice = val;
    this.filter();
  }

  get sliderMinPercent(): number {
    const range = this.priceRange.max - this.priceRange.min;
    return range ? ((this.sliderMin - this.priceRange.min) / range) * 100 : 0;
  }

  get sliderMaxPercent(): number {
    const range = this.priceRange.max - this.priceRange.min;
    return range ? ((this.sliderMax - this.priceRange.min) / range) * 100 : 100;
  }

  getColorFilters(colorVal: string) {
    if (this.colors.has(colorVal)) {
      this.colors.delete(colorVal);
    } else {
      this.colors.add(colorVal);
    }
    this.filter();
  }

  getSort(sortVal: string) {
    if (sortVal === "Asc") {
      this.filteredProducts = this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortVal === "Des") {
      this.filteredProducts = this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortVal === "PriceAsc") {
      this.filteredProducts = this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortVal === "PriceDes") {
      this.filteredProducts = this.filteredProducts.sort((a, b) => b.price - a.price);
    }
    this.sortToggle = false;
  }

  clearAllFilters() {
    this.checksCategory = [];
    this.checksBrand = [];
    this.minPrice = 0;
    this.maxPrice = 0;
    this.sliderMin = this.priceRange.min;
    this.sliderMax = this.priceRange.max;
    this.colors.clear();
    this.filteredProducts = this.products;
  }

  get activeFilterCount(): number {
    const priceActive = (this.sliderMin > this.priceRange.min || this.sliderMax < this.priceRange.max) ? 1 : 0;
    return this.checksCategory.length + this.checksBrand.length + priceActive + this.colors.size;
  }

  filter() {
    if (!this.checksCategory.length && !this.checksBrand.length && !this.maxPrice && !this.minPrice && !this.colors.size) {
      this.filteredProducts = this.products;
    }
    else {
      this.filteredProducts = this.products.filter(prod => {
        return (
          (!this.checksCategory.length || this.checksCategory.includes(prod.category)) &&
          (!this.checksBrand.length || this.checksBrand.includes(prod.brand)) &&
          (!this.minPrice || prod.price >= this.minPrice) &&
          (!this.maxPrice || prod.price <= this.maxPrice) &&
          (!this.colors.size || prod.colors.some(color => this.colors.has(color)))
        );
      });
    }
  }
}
