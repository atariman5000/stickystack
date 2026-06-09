import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { palette, projectTemplates } from '../app.constants';
import { ProjectFormModel } from '../models';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-dialog.component.html'
})
export class ProjectDialogComponent {
  @ViewChild('projectModal') private projectModal?: ElementRef<HTMLDialogElement>;
  @ViewChild('projectFormRef') private projectFormRef?: NgForm;

  @Output() projectCreated = new EventEmitter<ProjectFormModel>();

  readonly palette = palette;
  readonly projectTemplates = projectTemplates;
  projectForm: ProjectFormModel = this.emptyProjectForm();

  open(): void {
    this.projectFormRef?.resetForm();
    this.projectForm = this.emptyProjectForm();
    this.showModal();
  }

  createProject(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.projectCreated.emit({
      name: this.projectForm.name.trim(),
      description: this.projectForm.description.trim(),
      color: this.projectForm.color,
      templateType: this.projectForm.templateType
    });
    this.closeDialog();
    form.resetForm(this.emptyProjectForm());
  }

  closeDialog(): void {
    const dialog = this.projectModal?.nativeElement;
    if (!dialog) {
      return;
    }

    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  private emptyProjectForm(): ProjectFormModel {
    return { name: '', description: '', color: palette[0].value, templateType: projectTemplates[0].type };
  }

  private showModal(): void {
    const dialog = this.projectModal?.nativeElement;
    if (!dialog) {
      return;
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }
}
