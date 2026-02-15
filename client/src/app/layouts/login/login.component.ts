import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserServiceService } from '../../services/user/user-service.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  providers: [UserServiceService],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginError = '';
      const formData = this.loginForm.value;
      this.userService.login(formData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          if (localStorage.getItem('role') == 'admin') {
            window.location.href = '/admin-dashboard/overview';
          } else {
            // Use window.location.href to force full page reload
            // so navbar re-evaluates islogin() and shows profile/logout
            window.location.href = '/profile/information';
          }
        },
        error: (error) => {
          console.log('Login failed:', error);
          this.loginError = error?.error?.message || 'Incorrect username or password. Please try again.';
        },
      });
    }
  }
}
