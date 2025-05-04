import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('loginForm') loginForm!: NgForm;

  email = '';
  password = '';
  showPassword = false;
  errorMessage: string | null = null;
  isLoading = false;

  router = inject(Router);
  auth = inject(AuthService);

  handleKeyDown(event: Event) {
    const keyboardEvent = event as KeyboardEvent; // Rzutowanie na KeyboardEvent
    if (keyboardEvent.key === 'Enter' && this.email && this.password.length >= 6) {
      this.login();
    }
  }

  login() {
    if (!this.isValidForm()) {
      this.errorMessage = 'Wprowadź poprawny email i hasło (min. 6 znaków)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.auth.login(this.email, this.password)
      .then(() => this.router.navigate(['/']))
      .catch(err => {
        this.errorMessage = this.getFriendlyErrorMessage(err.code);
        console.error('Błąd logowania:', err);
      })
      .finally(() => this.isLoading = false);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    if (this.passwordInput) {
      this.passwordInput.nativeElement.type = this.showPassword ? 'text' : 'password';
    }
  }

  private isValidForm(): boolean {
    return this.email.includes('@') && this.password.length >= 6;
  }

  private getFriendlyErrorMessage(code: string): string {
    console.log('Kod błędu:', code);
    const messages: Record<string, string> = {
      'auth/invalid-email': 'Nieprawidłowy adres email',
      'auth/user-disabled': 'Konto zostało dezaktywowane',
      'auth/user-not-found': 'Użytkownik nie istnieje',
      'auth/invalid-credential': 'Nieprawidłowe hasło lub adres email',
      'auth/too-many-requests': 'Zbyt wiele prób, spróbuj później'
    };
    return messages[code] || 'Wystąpił nieoczekiwany błąd';
  }
}