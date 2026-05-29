import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../models';

@Component({
  selector: 'app-project-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-home.component.html'
})
export class ProjectHomeComponent {
  @Input({ required: true }) projects: Project[] = [];

  @Output() projectSelected = new EventEmitter<string>();

  private readonly tiltValues = [-2.4, 1.8, -1.2, 2.2];

  projectTilt(index: number): string {
    return `${this.tiltValues[index % this.tiltValues.length]}deg`;
  }
}
