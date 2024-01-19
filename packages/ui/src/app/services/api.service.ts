import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import { environment } from '../../environments/environment';
import { paths } from '../app.routes';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private local: LocalStorageService,
    private router: Router,
  ) {}

  treaty = edenTreaty<App>(environment.apiBaseUrl, {
    $fetch: {
      headers: {
        Authorization: `Bearer ${this.local.getApiToken()}`,
      },
    },
    transform: (response) => {
      // Fails authentication, old/invalid token. Clear token and send to login
      if (response.status === 401) {
        this.local.clearApiToken();
        this.router.navigate([paths.login]);
      }
    },
  });

  get api() {
    return this.treaty.api;
  }
}
