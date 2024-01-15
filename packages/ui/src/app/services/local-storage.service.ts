import { Injectable } from '@angular/core';

const API_TOKEN = 'apiToken';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getApiToken = () => localStorage.getItem(API_TOKEN);
  setApiToken = (apiToken: string) => localStorage.setItem(API_TOKEN, apiToken);
}
