import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, confirmPasswordReset, verifyPasswordResetCode, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, docData } from '@angular/fire/firestore';
import { BehaviorSubject, map, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    onAuthStateChanged(this.auth, (user) => this.user$.next(user));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    // zapis do Firestore: /users/{uid}
    const userRef = doc(this.firestore, `users/${cred.user.uid}`);
    await setDoc(userRef, {
      email: email,
      role: 'user',
      createdAt: new Date()
    });

    return cred;
  }

  async getUserRole(uid: string): Promise<string | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();
    return data?.['role'] ?? null;
  }

  logout() {
    return signOut(this.auth);
  }

  role$ = this.user$.pipe(
    switchMap(user => {
      if (!user) return of(null);
      const ref = doc(this.firestore, `users/${user.uid}`);
      return docData(ref).pipe(map(data => data?.['role'] ?? null));
    })
  );

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw this.translateAuthError(error);
    }
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    try {
      // Najpierw weryfikujemy kod
      const email = await verifyPasswordResetCode(this.auth, oobCode);
      console.log('Verified email for password reset:', email);

      // Następnie resetujemy hasło
      await confirmPasswordReset(this.auth, oobCode, newPassword);
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw this.translateAuthError(error);
    }
  }

  private translateAuthError(error: any): { code: string, message: string } {
    const errorMap: Record<string, string> = {
      'auth/user-not-found': 'Użytkownik o podanym emailu nie istnieje',
      'auth/invalid-email': 'Nieprawidłowy format emaila',
      'auth/expired-action-code': 'Link wygasł, wygeneruj nowy',
      'auth/invalid-action-code': 'Nieprawidłowy link resetujący',
      'auth/weak-password': 'Hasło musi mieć co najmniej 6 znaków',
      'auth/too-many-requests': 'Zbyt wiele prób, spróbuj później'
    };

    const code = error?.code || 'unknown';
    return {
      code: code,
      message: errorMap[code] || 'Wystąpił nieoczekiwany błąd'
    };
  }
}