import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RolesTableItem } from '@ftoggle/api/types/rolesTypes';
import { UserWithRoles } from '@ftoggle/api/types/usersTypes';
import { UserRole, UserRoleValues } from '@ftoggle/common/enums/roles';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [MatButtonModule, MatChipsModule, MatIconModule, MatTableModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  users = this.usersService.users;
  displayedColumns = ['name', 'roles'];
  allRoles = UserRoleValues;
  roleChangeInFlight = false;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.getUsers();
  }

  userHasRole(user: UserWithRoles, role: UserRole) {
    return user.usersRoles.map((ur) => ur.role.name).includes(role);
  }

  onSelectionChange(user: UserWithRoles, userRole: UserRole) {
    const hasRole = this.userHasRole(user, userRole);
    if (hasRole) {
      const role = user.usersRoles.find(
        (ur) => ur.role.name === userRole,
      )!.role;
      this.removeRole(user, role);
    } else {
      this.addRole(user, userRole);
    }
  }

  addRole(user: UserWithRoles, role: UserRole) {
    if (this.roleChangeInFlight) return;
    this.roleChangeInFlight = true;
    this.usersService
      .addRole(user, role)
      .then(() => this.getUsers())
      .finally(() => (this.roleChangeInFlight = false));
  }

  removeRole(user: UserWithRoles, role: RolesTableItem) {
    if (this.roleChangeInFlight) return;
    this.roleChangeInFlight = true;
    this.usersService
      .removeRole(user, role)
      .then(() => this.getUsers())
      .catch((err) => console.error('Error removing role', err))
      .finally(() => (this.roleChangeInFlight = false));
  }

  getUsers() {
    this.usersService.getUsers();
  }
}
