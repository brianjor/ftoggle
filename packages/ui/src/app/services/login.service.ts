import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { paths } from '../app.routes';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  async login(username: string, password: string) {
    try {
      const response = await this.apiService.api.auth.login.post({
        username,
        password,
      });
      if (response.status === 200) {
        console.info('Successful login');
        this.router.navigate([paths.projects]);
      }
    } catch (err) {
      console.error('Error logging in', err);
    }
  }
}
