import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ConditionWithContextField } from '@ftoggle/api/types/conditionsTypes';
import { EnvironmentsTableItem } from '@ftoggle/api/types/environmentTypes';
import { ConditionsService } from '../../../services/conditions.service';
import { EnvironmentsService } from '../../../services/environments.service';

@Component({
  selector: 'app-project-feature-conditions',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatTableModule],
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
    this.conditions.set(
      await this.conditionsService.getConditions(
        this.projectId,
        this.featureId,
        env.id,
      ),
    );
  }
}
