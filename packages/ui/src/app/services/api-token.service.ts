import { Injectable } from '@angular/core';
import { ApiTokenType } from '@ftoggle/common/enums/apiTokens';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiTokenService {
  constructor(private apiService: ApiService) {}

  public async createApiToken(fields: {
    projectId: string;
    name: string;
    environmentId: number;
    type: ApiTokenType;
  }) {
    const { projectId, name, environmentId, type } = fields;
    try {
      await this.apiService.api.projects[projectId].apiTokens.post({
        name,
        environmentId,
        type,
      });
    } catch (err) {
      console.error('Error creating api token', err);
    }
  }
}
