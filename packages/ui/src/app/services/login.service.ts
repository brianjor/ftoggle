import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    this.http
      .post(
        'http://localhost:8080/auth/login',
        JSON.stringify({ username, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'text',
        },
      )
      .subscribe({
        next: () => console.log('Signed in!'),
        error: (error) => console.error('Error logging in', error),
      });
  }
}
