import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ContextFieldsTableItem } from '@ftoggle/api/types/contextFieldsTypes';

@Component({
  selector: 'app-project-context-fields',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './context-fields.component.html',
  styleUrl: './context-fields.component.scss',
})
export class ProjectContextFieldsComponent {
  @Input({ required: true }) projectId = '';
  @Input({ required: true }) contextFields: ContextFieldsTableItem[] = [];
  @Output() getContextFieldsEvent = new EventEmitter();
  contextFieldsColumns = ['name', 'description'];

  ngOnInit() {
    this.getContextFields();
  }

  getContextFields() {
    this.getContextFieldsEvent.emit();
  }
}
