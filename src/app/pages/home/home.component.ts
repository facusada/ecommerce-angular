import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private productService = inject(ProductService);
  readonly products$: Observable<Product[]> = this.productService.getProducts();

  private readonly quantities: Record<number, number> = {};

  getQuantity(productId: number): number {
    if (!this.quantities[productId]) {
      this.quantities[productId] = 1;
    }

    return this.quantities[productId];
  }

  increaseQuantity(productId: number): void {
    this.quantities[productId] = this.getQuantity(productId) + 1;
  }

  decreaseQuantity(productId: number): void {
    const current = this.getQuantity(productId);

    if (current > 1) {
      this.quantities[productId] = current - 1;
    }
  }

  addToCart(product: Product): void {
    const quantity = this.getQuantity(product.id);
    console.log(`Agregar ${quantity} unidad(es) de ${product.name} al carrito (pendiente de implementar).`);
  }
}
