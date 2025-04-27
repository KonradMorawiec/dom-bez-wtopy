import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMessage: string | null = null;
  isLoading = false;
  router = inject(Router);
  auth = inject(AuthService);

  ngOnInit() {
    // if (this.auth.isLoggedIn()) {
    //   this.router.navigate(['/']);
    // }
  }

  login() {
    this.isLoading = true;
    this.errorMessage = null;

    if (!this.isValidForm()) {
      this.errorMessage = 'Wprowadź poprawny email i hasło (min. 6 znaków)';
      return;
    }

    this.auth.login(this.email, this.password)
      .then(() => this.router.navigate(['/']))
      .catch(err => {
        this.errorMessage = this.getFriendlyErrorMessage(err.code);
        console.error('Błąd logowania:', err);
      })
      .finally(() => this.isLoading = false);
  }

  private getFriendlyErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      'auth/invalid-email': 'Nieprawidłowy adres email',
      'auth/user-disabled': 'Konto zostało dezaktywowane',
      'auth/user-not-found': 'Użytkownik nie istnieje',
      'auth/wrong-password': 'Nieprawidłowe hasło',
      'auth/too-many-requests': 'Zbyt wiele prób, spróbuj później'
    };
    return messages[code] || 'Wystąpił nieoczekiwany błąd';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField = document.querySelector('[name="password"]') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  isValidForm(): boolean {
    return this.email.includes('@') && this.password.length >= 6;
  }
}
