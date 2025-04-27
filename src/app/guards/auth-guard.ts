import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);

  return new Observable<boolean>((observer) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });

    return { unsubscribe };
  });
};