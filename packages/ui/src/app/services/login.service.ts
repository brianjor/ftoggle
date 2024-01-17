import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { edenFetch } from '@elysiajs/eden';
import type { App } from '@ftoggle/api';
import { from } from 'rxjs';
import { environment } from '../../environments/environment';
import { paths } from '../app.routes';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  api = edenFetch<App>(environment.apiBaseUrl);
  constructor(
    private router: Router,
    private local: LocalStorageService,
  ) {}

  login(username: string, password: string) {
    from(
      this.api('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      }),
    ).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.info('Successful login');
          this.local.setApiToken(response.data?.accessToken ?? '');
          this.router.navigate([paths.projects]);
        }
      },
      error: (error) => console.error('Error logging in', error),
    });
  }
}
