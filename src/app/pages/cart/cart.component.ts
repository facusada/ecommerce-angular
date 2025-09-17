import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService, CartLine } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private cartService = inject(CartService);

  readonly cartItems = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;
  readonly taxEstimate = computed(() => this.subtotal() * 0.21);
  readonly total = computed(() => this.subtotal() + this.taxEstimate());

  trackByProductId(_index: number, line: CartLine): number {
    return line.product.id;
  }
}
