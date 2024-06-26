import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ContextFieldsTableItem } from '@ftoggle/api/types/contextFieldsTypes';
import { CreateContextFieldDialogComponent } from '../../../../components/create-context-field-dialog/create-context-field-dialog.component';
import { ContextFieldsService } from '../../../../services/contextFields.service';

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
  contextFieldsColumns = ['name', 'description', 'delete'];
  deleteContextFieldInFlight = false;

  constructor(
    private contextFieldsService: ContextFieldsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getContextFields();
  }

  getContextFields() {
    this.getContextFieldsEvent.emit();
  }

  openCreateContextFieldDialog() {
    const createContextFieldDialog = this.dialog.open(
      CreateContextFieldDialogComponent,
      {
        data: { projectId: this.projectId },
      },
    );
    createContextFieldDialog
      .afterClosed()
      .subscribe(() => this.getContextFields());
  }

  deleteContextField(contextField: ContextFieldsTableItem) {
    if (this.deleteContextFieldInFlight) return;
    this.deleteContextFieldInFlight = true;
    this.contextFieldsService
      .deleteContextField(this.projectId, contextField)
      .then(() => this.getContextFields())
      .finally(() => (this.deleteContextFieldInFlight = false));
  }
}
