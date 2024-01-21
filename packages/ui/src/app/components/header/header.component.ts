import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { paths } from '../../app.routes';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  paths = paths;

  constructor(
    private local: LocalStorageService,
    private router: Router,
  ) {}

  handleLogout() {
    this.local.clearApiToken();
    this.router.navigate([paths.login]);
  }
}
