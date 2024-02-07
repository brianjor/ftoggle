import { Injectable, signal } from '@angular/core';
import { UserWithRoles } from '@ftoggle/api/types/usersTypes';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _users = signal<UserWithRoles[]>([]);
  public users = this._users.asReadonly();

  constructor(private apiService: ApiService) {}

  async getUsers() {
    const { data, response, error } =
      await this.apiService.api.users.roles.get();
    if (response.ok) {
      this._users.set(data?.users ?? []);
    } else {
      console.log('Error getting users', error?.message);
    }
  }
}
