import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';  

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  mode: 'login' | 'register' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    
    // Initialize login and register forms with validators
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });

    this.registerForm = this.fb.group({
      newUsername: [null, [Validators.required, Validators.minLength(3)]],
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      newEmail: [null, [Validators.required, Validators.email]],
      dob: [null, [Validators.required, this.validateDateFormat]]
    });

    // Reset forms initially
    this.loginForm.reset();
    this.registerForm.reset();
  }

  // Attempt to log in using the provided credentials
  login(): void {
    if (this.loginForm.valid) {
      const loginPayload = this.loginForm.value;

      this.authService.login(loginPayload).subscribe(
        (response) => {
          console.log('Login successful. Response:', response);
          this.openSnackBar("Logged in successfully",'success');
          this.router.navigate(['home']);
        },
        (error) => {
          console.error('Login failed. Error:', error);
        }
      );
    }
  }

  // Attempt to register a new user with the provided information
  register(): void {
    if (this.registerForm.valid) {
      const registerPayload = {
        username: this.registerForm.get('newUsername')?.value,
        password: this.registerForm.get('newPassword')?.value,
        email: this.registerForm.get('newEmail')?.value, // Add email field
        dob: this.registerForm.get('dob')?.value // Add dob field
      };

      this.authService.register(registerPayload).subscribe(
        (response) => {
          console.log('Registration successful. Response:', response);
          this.openSnackBar("Registered in successfully",'success');
          this.router.navigate(['home']);
        },
        (error) => {
          console.error('Registration failed. Error:', error);
        }
      );
    }
  }

  // Toggle between login and register modes
  toggleMode(newMode: 'login' | 'register'): void {
    this.mode = newMode;
  }

  // Custom validator for date format
  validateDateFormat(control: any): { [key: string]: boolean } | null {
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;
    return dobRegex.test(control.value) ? null : { 'invalidDateFormat': true };
  }

  // Format date input with slashes
  formatDate(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    if (value.length === 8) {
      const formattedDate = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
      this.registerForm.get('dob')?.setValue(formattedDate);
    }
  }

  // Open a snackbar with the given message and styling
  openSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
