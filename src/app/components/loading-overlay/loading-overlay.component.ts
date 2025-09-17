import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent {
  protected loadingService = inject(LoadingService);
}
