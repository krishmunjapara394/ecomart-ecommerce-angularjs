import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../interfaces/product';
import { UserServiceService } from '../../services/user/user-service.service';
import { CountService } from '../../services/count/count.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent],
  providers: [ProductService, UserServiceService],
  templateUrl: './product-overview.component.html',
  styles: ``
})

export class ProductOverviewComponent {

  id: any;
  product: Product | undefined;
  primaryImage = '';
  availability = '';
  stock = 0;
  relatedProducts: Product[] = [];
  isLoading = true;
  sizes = new Set<string>();
  colors = new Set<string>();
  wishListBtn = false;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserServiceService,
    private localStorage: LocalStorageService,
    private countService: CountService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Subscribe to route param changes so navigating between products reloads data
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isLoading = true;
      this.primaryImage = '';
      this.quantity = 1;
      this.sizes.clear();
      this.colors.clear();
      this.loadProduct();
    });
  }

  loadProduct() {
    this.productService.getProductById(this.id).subscribe({
      next: (data) => {
        this.product = data;
        this.stock = data.stock;
        this.primaryImage = data.images?.[0] || '';
        this.isLoading = false;

        const products: any = this.localStorage.getItem('wishList');
        if (this.product) {
          if (products && products.some((prod: any) => prod._id === this.product?._id)) {
            this.wishListBtn = true;
          }
        }

        // Load related products (same category)
        this.loadRelatedProducts();
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  loadRelatedProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        const allProducts = data.products || data;
        this.relatedProducts = allProducts
          .filter((p: Product) => p.category === this.product?.category && p._id !== this.product?._id)
          .slice(0, 4);

        // If not enough from same category, fill with others
        if (this.relatedProducts.length < 4) {
          const otherProducts = allProducts
            .filter((p: Product) => p._id !== this.product?._id && !this.relatedProducts.some(r => r._id === p._id))
            .slice(0, 4 - this.relatedProducts.length);
          this.relatedProducts = [...this.relatedProducts, ...otherProducts];
        }
      },
      error: (error) => console.error(error)
    });
  }

  activeImage(image: string) {
    if (image) {
      this.primaryImage = image;
    }
  }

  checkAvailability(): boolean {
    return this.stock > 0;
  }

  incrementQuantity() {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There is no enough quantity in the stock!',
      });
      return;
    }
    this.userService.addCart(this.id, this.quantity).subscribe({
      next: (data) => {
        this.countService.setProduct();
        Swal.fire({
          icon: 'success',
          title: 'Great!',
          text: 'Product Added To Your Cart Successfully'
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong. Please try again later.'
        });
      }
    });
  }

  getColorFilters(colorVal: string) {
    if (this.colors.has(colorVal)) {
      this.colors.delete(colorVal);
    } else {
      this.colors.add(colorVal);
    }
  }

  getSizeFilters(sizeVal: string) {
    if (this.sizes.has(sizeVal)) {
      this.sizes.delete(sizeVal);
    } else {
      this.sizes.add(sizeVal);
    }
  }

  addProductToWishList() {
    let products: any;
    if (this.localStorage.getItem('wishList')) {
      products = this.localStorage.getItem('wishList');
      if (products.some((prod: any) => prod._id === this.product?._id)) {
        products = products.filter((prod: any) => prod._id !== this.product?._id);
      } else {
        products.push(this.product);
      }
      this.localStorage.setItem('wishList', products);
    } else {
      products = [];
      products.push(this.product);
      this.localStorage.setItem('wishList', products);
    }
  }
}
