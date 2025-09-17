import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, defer, finalize, map, of, shareReplay } from 'rxjs';

import { Product } from '../models/product';
import { LoadingService } from './loading.service';

interface ApiCategory {
  id: number;
  name: string;
}

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: ApiCategory;
}

const PRODUCTS_ENDPOINT = 'https://api.escuelajs.co/api/v1/products';
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300.png?text=Sin+imagen';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products$ = defer(() => {
    this.loading.start();
    return this.http.get<ApiProduct[]>(PRODUCTS_ENDPOINT).pipe(
      map((apiProducts) => apiProducts.map((item) => this.mapApiProduct(item))),
      catchError((error) => {
        console.error('No se pudieron obtener los productos', error);
        return of<Product[]>([]);
      }),
      finalize(() => this.loading.stop())
    );
  }).pipe(shareReplay(1));

  constructor(
    private http: HttpClient,
    private loading: LoadingService
  ) {}

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map((products) => products.find((product) => product.id === id))
    );
  }

  private mapApiProduct(item: ApiProduct): Product {
    const image = item.images?.find((src) => !!src) ?? FALLBACK_IMAGE;

    return {
      id: item.id,
      name: item.title,
      price: item.price,
      category: item.category?.name,
      description: item.description,
      image,
      features: undefined
    };
  }
}
