import { Injectable, signal } from '@angular/core';
import { ApiTokensTableItem } from '@ftoggle/api/types/apiTokensTypes';
import { ApiTokenType } from '@ftoggle/common/enums/apiTokens';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiTokenService {
  private _apiTokens = signal<ApiTokensTableItem[]>([]);
  public apiTokens = this._apiTokens.asReadonly();

  constructor(private apiService: ApiService) {}

  public async createApiToken(fields: {
    projectId: string;
    name: string;
    environmentId: string;
    type: ApiTokenType;
  }) {
    const { projectId, name, environmentId, type } = fields;
    try {
      await this.apiService.api.projects({ projectId }).apiTokens.post({
        name,
        environmentId,
        type,
      });
    } catch (err) {
      console.error('Error creating api token', err);
    }
  }

  async getApiTokens(projectId: string) {
    try {
      const response = await this.apiService.api
        .projects({ projectId })
        .apiTokens.get();
      this._apiTokens.set(response.data?.tokens ?? []);
    } catch (err) {
      console.error('Error getting api tokens', err);
    }
  }

  async deleteApiToken(projectId: string, apiTokenId: string) {
    try {
      await this.apiService.api
        .projects({ projectId })
        .apiTokens({ apiTokenId })
        .delete();
    } catch (err) {
      console.error('Error creating api token', err);
    }
  }
}
