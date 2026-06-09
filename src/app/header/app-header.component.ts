import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
  @Input({ required: true }) pageTitle = '';
  @Input({ required: true }) pageSubtitle = '';
  @Input({ required: true }) isBoardView = false;

  @Output() homeSelected = new EventEmitter<void>();
  @Output() projectFormRequested = new EventEmitter<void>();
  @Output() laneFormRequested = new EventEmitter<void>();
  @Output() noteFormRequested = new EventEmitter<void>();
}
