import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CountService } from '../../services/count/count.service';
import { Product } from '../../interfaces/product';
import { UserServiceService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  providers: [ProductService, UserServiceService],
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent implements OnInit {
  toggleBurgerMenu = false;
  searchForm: FormGroup;
  searchValue = '';
  searchResults: string[] = [];
  proudctFilter: Product[] = [];
  products: Product[] = [];
  categories: string[] = [];
  showCategoryDropdown = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private countService: CountService,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      search: ['', Validators.required],
    });
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data.products;
        this.categories = [...new Set(this.products.map(p => p.category))].sort();
      },
      error: (error) => {
        console.error('404 Not Found');
      },
    });
  }

  data: number = 0;

  ngOnInit(): void {
    this.countService.selectedProduct.subscribe((value) => {
      this.data = value;
    });
  }

  toggleMenu() {
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
  }

  closeMenu() {
    this.toggleBurgerMenu = false;
  }

  search() {
    if (this.searchForm.valid && this.searchForm.value.search.trim() !== '') {
      this.searchValue = this.searchForm.value.search;
      this.proudctFilter = this.getFilteredProducts(this.searchValue);
    } else {
      this.proudctFilter = [];
    }
  }

  emptySearch() {
    this.searchForm.reset();
    this.proudctFilter = [];
  }

  goToProduct(productId: string) {
    this.emptySearch();
    this.router.navigate(['/product-overview', productId]);
  }

  getFilteredProducts(term: string): Product[] {
    if (!term || term.trim() === '') return [];
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  isAuthenticated() {
    return this.userService.isLoggedIn();
  }

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  goToCategory(category: string) {
    this.showCategoryDropdown = false;
    this.router.navigate(['/catalog'], { queryParams: { category } });
  }

  goToCatalog() {
    this.showCategoryDropdown = false;
    this.router.navigate(['/catalog']);
  }
}
