import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
  duration: number;
}

const DEFAULT_DURATION = 3000;

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messagesSignal = signal<ToastMessage[]>([]);

  readonly messages = this.messagesSignal.asReadonly();

  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  showSuccess(text: string, duration = DEFAULT_DURATION): void {
    this.pushMessage('success', text, duration);
  }

  showError(text: string, duration = DEFAULT_DURATION): void {
    this.pushMessage('error', text, duration);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.messagesSignal.set(
      this.messagesSignal().filter((message) => message.id !== id)
    );
  }

  clear(): void {
    this.messagesSignal().forEach((message) => this.dismiss(message.id));
  }

  private pushMessage(type: ToastType, text: string, duration: number): void {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const message: ToastMessage = { id, type, text, duration };

    this.messagesSignal.set([...this.messagesSignal(), message]);

    const timer = setTimeout(() => this.dismiss(id), duration);
    this.timers.set(id, timer);
  }
}
