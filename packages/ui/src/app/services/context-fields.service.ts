import { Injectable, signal } from '@angular/core';
import { ContextFieldsTableItem } from '@ftoggle/api/types/contextFieldsTypes';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ContextFieldsService {
  private _contextFields = signal<ContextFieldsTableItem[]>([]);
  public contextFields = this._contextFields.asReadonly();

  constructor(private apiService: ApiService) {}

  public async getContextFields(projectId: string) {
    try {
      const response =
        await this.apiService.api.projects[projectId]['context-fields'].get();
      this._contextFields.set(response.data?.contextFields ?? []);
    } catch (error) {
      console.error('Error getting context fields', error);
    }
  }
}
