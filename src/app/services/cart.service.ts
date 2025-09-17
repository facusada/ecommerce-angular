import { Injectable, computed, signal } from '@angular/core';

import { Product } from '../models/product';

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface AddCartResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSignal = signal<CartLine[]>([]);

  readonly items = computed(() => this.itemsSignal());
  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((acc, line) => acc + line.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.itemsSignal().reduce(
      (acc, line) => acc + line.product.price * line.quantity,
      0
    )
  );

  addItem(product: Product | undefined, quantity = 1): AddCartResult {
    if (!product) {
      return { success: false, message: 'El producto no existe.' };
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return {
        success: false,
        message: 'La cantidad tiene que ser un numero mayor que cero.'
      };
    }

    const current = this.itemsSignal();
    const index = current.findIndex((line) => line.product.id === product.id);

    if (index !== -1) {
      const updated = [...current];
      const existing = updated[index];
      updated[index] = {
        ...existing,
        quantity: existing.quantity + quantity
      };
      this.itemsSignal.set(updated);
      return {
        success: true,
        message: `${quantity} unidad(es) sumadas al carrito.`
      };
    }

    this.itemsSignal.set([
      ...current,
      {
        product,
        quantity
      }
    ]);

    return {
      success: true,
      message: `${product.name} agregado al carrito.`
    };
  }

  removeItem(productId: number): void {
    this.itemsSignal.set(
      this.itemsSignal().filter((line) => line.product.id !== productId)
    );
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}
