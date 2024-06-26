import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  ConditionWithContextField,
  ConditionsTableItem,
} from '@ftoggle/api/types/conditionsTypes';
import { ContextFieldsTableItem } from '@ftoggle/api/types/contextFieldsTypes';
import { EnvironmentsTableItem } from '@ftoggle/api/types/environmentTypes';
import {
  MultiValueOperatorsValues,
  SingleValueOperatorsValues,
} from '@ftoggle/common/enums/operators';
import { CreateConditionDialogComponent } from '../../../components/create-condition-dialog/create-condition-dialog.component';
import { EditConditionDialogComponent } from '../../../components/edit-condition-dialog/edit-condition-dialog.component';
import { ConditionsService } from '../../../services/conditions.service';
import { ContextFieldsService } from '../../../services/contextFields.service';
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
  featureName = '';
  environments = this.environmentsService.environments;
  contextFields = signal<ContextFieldsTableItem[]>([]);
  conditions = signal<ConditionWithContextField[]>([]);
  conditionColumns = ['field', 'operator', 'values', 'edit', 'delete'];
  panel = '';
  deleteConditionInFlight = signal(false);
  singleValueOperators = SingleValueOperatorsValues;
  multiValueOperators = MultiValueOperatorsValues;

  constructor(
    private conditionsService: ConditionsService,
    private contextFieldsService: ContextFieldsService,
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
    const featureName = this.route.snapshot.paramMap.get('featureName');
    if (featureName === null) {
      console.error(
        `${this.constructor.name} requires a ":featureName" url parameter`,
      );
    } else {
      this.featureName = featureName;
    }
    this.environmentsService.getEnvironments(this.projectId);
    this.contextFieldsService
      .getContextFields(this.projectId)
      .then((cFields) => this.contextFields.set(cFields));
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
        this.featureName,
        env.name,
      ),
    );
  }

  openCreateConditionDialog(env: EnvironmentsTableItem) {
    const createConditionDialogRef = this.dialog.open(
      CreateConditionDialogComponent,
      {
        data: {
          contextFields: this.contextFields(),
          projectId: this.projectId,
          featureName: this.featureName,
          environmentName: env.name,
        },
      },
    );
    createConditionDialogRef
      .afterClosed()
      .subscribe(() => this.getConditions(env));
  }

  openEditConditionDialog(
    condition: ConditionsTableItem,
    env: EnvironmentsTableItem,
  ) {
    const editConditionDialogRef = this.dialog.open(
      EditConditionDialogComponent,
      {
        data: {
          condition,
          projectId: this.projectId,
          featureName: this.featureName,
          environmentName: env.name,
        },
      },
    );
    editConditionDialogRef
      .afterClosed()
      .subscribe(() => this.getConditions(env));
  }

  deleteCondition(
    condition: ConditionWithContextField,
    env: EnvironmentsTableItem,
  ) {
    if (this.deleteConditionInFlight()) return;
    this.deleteConditionInFlight.set(true);
    this.conditionsService
      .deleteCondition(condition, this.featureName, env.name)
      .then(() => this.getConditions(env))
      .finally(() => this.deleteConditionInFlight.set(false));
  }
}
