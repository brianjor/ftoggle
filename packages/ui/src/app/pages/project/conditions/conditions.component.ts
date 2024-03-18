import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConditionWithContextField } from '@ftoggle/api/types/conditionsTypes';
import { EnvironmentsTableItem } from '@ftoggle/api/types/environmentTypes';
import { CreateConditionDialogComponent } from '../../../components/create-condition-dialog/create-condition-dialog.component';
import { ConditionsService } from '../../../services/conditions.service';
import { EnvironmentsService } from '../../../services/environments.service';

@Component({
  selector: 'app-project-feature-conditions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './conditions.component.html',
  styleUrl: './conditions.component.scss',
})
export class ConditionsComponent {
  projectId = '';
  featureId = '';
  environments = this.environmentsService.environments;
  conditions = signal<ConditionWithContextField[]>([]);
  conditionColumns = ['field', 'operator', 'values'];
  panel = '';

  constructor(
    private conditionsService: ConditionsService,
    private environmentsService: EnvironmentsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId === null) {
      console.error(
        `${this.constructor.name} requires a ":projectId" url parameter`,
      );
    } else {
      this.projectId = projectId;
    }
    const featureId = this.route.snapshot.paramMap.get('featureId');
    if (featureId === null) {
      console.error(
        `${this.constructor.name} requires a ":featureId" url parameter`,
      );
    } else {
      this.featureId = featureId;
    }
    this.environmentsService.getEnvironments(this.projectId);
  }

  setPanel(env: EnvironmentsTableItem) {
    this.panel = env.name;
    this.getConditions(env);
  }

  async getConditions(env: EnvironmentsTableItem) {
    this.conditions.set([]);
    this.conditions.set(
      await this.conditionsService.getConditions(
        this.projectId,
        this.featureId,
        env.id,
      ),
    );
  }

  openCreateConditionDialog(env: EnvironmentsTableItem) {
    const createConditionDialogRef = this.dialog.open(
      CreateConditionDialogComponent,
      {
        data: {
          projectId: this.projectId,
          featureId: this.featureId,
          environmentId: env.id,
        },
      },
    );
    createConditionDialogRef
      .afterClosed()
      .subscribe(() => this.getConditions(env));
  }
}
