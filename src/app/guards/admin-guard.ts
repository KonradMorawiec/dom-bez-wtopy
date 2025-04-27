import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await auth.currentUser;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const role = await authService.getUserRole(user.uid);
  if (role === 'admin') {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
