import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { UsersTableItem } from '@ftoggle/api/types/usersTypes';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _users = signal<UsersTableItem[]>([]);
  public users = this._users.asReadonly();

  constructor(private apiService: ApiService) {}

  async getUsers() {
    const response = await this.apiService.api.users.get();
    if (response.status === 200) {
      this._users.set(response.data?.data.users ?? []);
    } else {
      console.log('Error getting users', response.error?.message);
    }
  }
}
