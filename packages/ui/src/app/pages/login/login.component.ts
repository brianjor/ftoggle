import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  loginForm = this.formBuilder.group({
    username: this.username,
    password: this.password,
  });

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
  ) {}

  handleLogin = () => {
    if (!this.loginForm.valid) return;
    const username = this.loginForm.controls.username.value as string;
    const password = this.loginForm.controls.password.value as string;
    this.loginService.login(username, password);
  };
}
