import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApiTokensTableItem, EnvironmentsTableItem } from '@ftoggle/api/types';
import { CreateApiTokenDialogComponent } from '../../../../components/create-api-token-dialog/create-api-token-dialog.component';
import { ApiTokenService } from '../../../../services/api-token.service';

@Component({
  selector: 'app-project-api-tokens',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './api-tokens.component.html',
  styleUrl: './api-tokens.component.scss',
})
export class ProjectApiTokensComponent {
  @Input({ required: true }) projectId = '';
  @Input({ required: true }) apiTokens: ApiTokensTableItem[] = [];
  @Input({ required: true }) environments: EnvironmentsTableItem[] = [];
  @Output() getApiTokensEvent = new EventEmitter();
  apiTokenColumns = ['name', 'created', 'type', 'copy', 'delete'];
  deleteApiTokenInFlight = false;

  constructor(
    private clipboard: Clipboard,
    private apiTokenService: ApiTokenService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getApiTokens();
  }

  getApiTokens() {
    this.getApiTokensEvent.emit();
  }

  openCreateApiTokenDialog() {
    const createApiTokenDialogRef = this.dialog.open(
      CreateApiTokenDialogComponent,
      {
        data: { projectId: this.projectId, environments: this.environments },
      },
    );
    createApiTokenDialogRef.afterClosed().subscribe(() => this.getApiTokens());
  }

  copyApiToken(apiToken: ApiTokensTableItem) {
    const env = this.environments.find((e) => e.id === apiToken.environmentId);
    if (env === undefined) {
      console.error('Unable to find environment for the token');
    } else {
      this.clipboard.copy(`${this.projectId}:${env.name}:${apiToken.id}`);
    }
  }

  deleteApiToken(apiToken: ApiTokensTableItem) {
    if (this.deleteApiTokenInFlight) return;
    this.deleteApiTokenInFlight = true;
    this.apiTokenService
      .deleteApiToken(this.projectId, apiToken.id)
      .then(() => this.getApiTokens())
      .finally(() => (this.deleteApiTokenInFlight = false));
  }
}
