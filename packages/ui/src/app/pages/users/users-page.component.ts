import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserWithRoles } from '@ftoggle/api/types/usersTypes';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  users = this.usersService.users;
  displayedColumns = ['name', 'roles'];

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsers();
  }

  getUsersRoleNames(user: UserWithRoles) {
    return user.usersRoles.map((r) => r.role.name);
  }
}
