import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common'; // Para el error del pipe 'number'
import { HighlightChangeDirective } from '../../shared/directives/highlight-change.directive';



@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [DecimalPipe, HighlightChangeDirective], // Importa lo que usa el HTML
  templateUrl: './crypto-card.component.html',
  styleUrl: './crypto-card.component.css'
})
export class CryptoCardComponent {

  //  @Input: Define las "ventanas" por donde entra la información desde el componente padre (Dashboard)

  // Recibe el objeto con id, name, price, etc. El uso de 'any' es flexible, aunque lo ideal sería una interfaz
  @Input() data!: any;

  // Recibe el límite de precio para saber cuándo activar la clase CSS de alerta
  @Input() threshold!: number;

  // Recibe los cálculos matemáticos procesados por el Web Worker
  // El '?' indica que es opcional, ya que al inicio el Worker podría no haber enviado datos aún
  @Input() stats?: { volatility: number };
}
