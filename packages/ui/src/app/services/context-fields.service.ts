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

  public async createContextField(
    projectId: string,
    name: string,
    description?: string,
  ) {
    try {
      await this.apiService.api.projects[projectId]['context-fields'].post({
        name,
        description,
      });
    } catch (error) {
      console.error('Error creating context field', error);
    }
  }

  /**
   * Gets a projects context fields.
   * @param projectId id of the project
   * @returns list of context fields
   */
  public async getContextFields(
    projectId: string,
  ): Promise<ContextFieldsTableItem[]> {
    let cFields: ContextFieldsTableItem[] = [];
    try {
      const { data, error, response } =
        await this.apiService.api.projects[projectId]['context-fields'].get();
      if (!response.ok) {
        throw error;
      }
      cFields = data?.contextFields ?? [];
      this._contextFields.set(cFields);
    } catch (err) {
      console.error('Error getting context fields', err);
    }
    return cFields;
  }

  public async deleteContextField(
    projectId: string,
    contextField: ContextFieldsTableItem,
  ) {
    try {
      await this.apiService.api.projects[projectId]['context-fields'][
        contextField.name
      ].delete();
    } catch (error) {
      console.error('Error deleting context field', error);
    }
  }
}
