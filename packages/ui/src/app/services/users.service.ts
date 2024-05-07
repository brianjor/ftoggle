import { Injectable, signal } from '@angular/core';
import { RolesTableItem } from '@ftoggle/api/types/rolesTypes';
import { UserWithRoles, UsersTableItem } from '@ftoggle/api/types/usersTypes';
import { UserRole } from '@ftoggle/common/enums/roles';
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
    if (!response.ok) {
      console.error('Error getting users', error?.message);
    }
    this._users.set(data?.users ?? []);
  }

  async setApproval(user: UsersTableItem, approval: boolean) {
    const { response, data } = await this.apiService.api.users[user.id].patch({
      isApproved: approval,
    });
    if (!response.ok) {
      console.error('Error setting user approval', data);
    }
  }

  async addRole(user: UsersTableItem, role: UserRole) {
    const { response, error } = await this.apiService.api.users[
      user.id
    ].roles.post({
      role,
    });
    if (!response.ok) {
      console.error('Error adding role', error?.message);
    }
  }

  async removeRole(user: UsersTableItem, role: RolesTableItem) {
    const { response, data } =
      await this.apiService.api.users[user.id].roles[role.id].delete();
    if (!response.ok) {
      console.error('Error removing role:', data);
    }
  }
}
