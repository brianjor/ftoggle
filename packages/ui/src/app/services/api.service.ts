import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { edenTreaty } from '@elysiajs/eden';
import { App } from '@ftoggle/api';
import { environment } from '../../environments/environment';
import { paths } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private router: Router) {}

  private treaty = edenTreaty<App>(environment.apiBaseUrl, {
    transform: (response) => {
      // Fails authentication, old/invalid token. Clear token and send to login
      if (response.status === 401) {
        this.router.navigate([paths.login]);
      }
    },
  });

  get api() {
    return this.treaty.api;
  }
}
