import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirm = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) { }

  register() {
    if (this.password !== this.confirm) {
      this.error = 'Hasła nie są takie same!';
      return;
    }

    this.auth.register(this.email, this.password)
      .then(() => {
        this.router.navigate(['/admin']); // lub gdzie chcesz przekierować
      })
      .catch((err: any) => {
        if (err.code === 'auth/email-already-in-use') {
          this.error = 'Ten adres e-mail jest już zajęty.';
        } else {
          this.error = 'Wystąpił błąd. Spróbuj ponownie.';
        }
      });
  }
}