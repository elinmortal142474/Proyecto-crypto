import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {

  private router = inject(Router);

  // 👇 MÉTODO PARA REDIRIGIR
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
