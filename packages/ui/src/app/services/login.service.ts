import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { edenFetch } from '@elysiajs/eden';
import type { App } from '@ftoggle/api';
import { from } from 'rxjs';
import { environment } from '../../environments/environment';
import { paths } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  api = edenFetch<App>(environment.apiBaseUrl);
  constructor(private router: Router) {}

  login(username: string, password: string) {
    from(
      this.api('/auth/login', { method: 'POST', body: { username, password } }),
    ).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.info('Successful login');
          localStorage.setItem('apiToken', response.data?.accessToken ?? '');
          this.router.navigate([paths.projects]);
        }
      },
      error: (error) => console.error('Error logging in', error),
    });
  }
}
