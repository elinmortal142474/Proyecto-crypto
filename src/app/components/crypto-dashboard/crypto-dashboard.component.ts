import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CryptoDataService } from '../../core/services/crypto-data.service';
import { CryptoCardComponent } from '../crypto-card/crypto-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crypto-dashboard',
  standalone: true,
  imports: [CryptoCardComponent],
  templateUrl: './crypto-dashboard.component.html',
  styleUrl: './crypto-dashboard.component.css',
  // OnPush: Mejora el rendimiento. Angular solo revisa este componente
  // si un Signal cambia o llega un @Input nuevo.
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block; flex: 1; width: 100%;'
  }
})
export class CryptoDashboardComponent {

  private dataService = inject(CryptoDataService);
  private router = inject(Router);


  // Signals para el estado local
  threshold = signal(65000); // El umbral de alerta que el usuario escribe

  // Inicializamos el Web Worker para que los cálculos matemáticos (volatilidad)
  // no congelen la interfaz mientras hay animaciones.
  private worker = new Worker(
    new URL('../../app.worker', import.meta.url)
  );

  // Es Record para guardar stats de múltiples monedas
 readonly stats = signal<Record<string, { mean: number; volatility: number }>>({});

  // Computed: Este Signal se actualiza automáticamente cada vez que el servicio cambia sus precios.
  readonly cryptos = computed(() =>
    this.dataService.rawPrices()
  );

  constructor() {
    // Escuchamos cuando el Worker termina de calcular
    this.worker.onmessage = ({ data }) => {
      if(data){
        this.stats.update(currentStats => ({
          ...currentStats,
          [data.id]: data // Guardamos los resultados (volatilidad, media) vinculados al ID de la cripto
        }));

      }
    };

    // Effect: Un "vigilante". Cada vez que el historial de precios cambia,
    // le manda los datos al Worker para que trabaje en segundo plano.
    effect(() => {
      const historyRecord = this.dataService.priceHistory();
      const currentCryptos = this.cryptos();

      currentCryptos.forEach(crypto => {
        const history = historyRecord[crypto.id];
        if (history && history.length >= 10) {
         this.worker.postMessage({
           id: crypto.id, // Enviamos el ID
           prices: history,
           windowSize: 10
        });
      }
      } )

    });
  }

  updateThreshold(event: Event) {
    const input = event.target as HTMLInputElement;
    this.threshold.set(+input.value);
  }

  // MÉTODO PARA VOLVER AL INICIO
  goToIndex() {
    this.router.navigate(['/']);
  }
}
