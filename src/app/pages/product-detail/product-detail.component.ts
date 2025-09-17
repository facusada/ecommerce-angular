import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  readonly product$: Observable<Product | undefined> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = Number(params.get('id'));
      return this.productService.getProductById(id);
    })
  );

  quantity = 1;

  increaseQuantity(): void {
    this.quantity += 1;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  addToCart(product: Product): void {
    const result = this.cartService.addItem(product, this.quantity);

    if (result.success) {
      this.toastService.showSuccess(result.message);
    } else {
      this.toastService.showError(result.message);
    }
  }
}
