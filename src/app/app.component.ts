import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Añade esto
import { CryptoDashboardComponent } from './components/crypto-dashboard/crypto-dashboard.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent], // Añadimos los componentes necesarios
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crypto-monitor';
}

// Bloque de Verificación de Web Worker:
// Se ejecuta al cargar la app para confirmar que el navegador soporta hilos secundarios.
if (typeof Worker !== 'undefined') {
  // Crea una instancia de prueba del worker.
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  // Escucha si el worker responde (solo para depuración inicial).
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  // Envía un mensaje de saludo para activar el worker.
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}
