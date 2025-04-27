import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dom-bez-wtopy';
  isMenuOpen = false;
  auth = inject(AuthService);
  router = inject(Router);
  user$ = this.auth.user$;
  role$ = this.auth.role$;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.auth.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }

  handleLoginClick(): void {
    // Dodatkowa logika przed nawigacją (opcjonalnie)
    console.log('Navigating to login...');
    this.router.navigate(['/login']);
  }
}
