import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css',
})
export class DeliveryComponent {
  selectedMethod: string = '';
  @Output() isChecked: EventEmitter<any> = new EventEmitter();

  selectMethod(method: string) {
    this.selectedMethod = method;
    this.isChecked.emit(true);
  }
}
