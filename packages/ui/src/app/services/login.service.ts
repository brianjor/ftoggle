import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { edenFetch } from '@elysiajs/eden';
import type { App } from '@ftoggle/api';
import { from } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  api = edenFetch<App>(environment.apiBaseUrl);
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    from(
      this.api('/auth/login', { method: 'POST', body: { username, password } }),
    ).subscribe({
      next: (response) =>
        localStorage.setItem('apiToken', response.data?.accessToken ?? ''),
      error: (error) => console.error('Error logging in', error),
    });
  }
}
