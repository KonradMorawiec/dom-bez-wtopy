import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminArticlesComponent } from './admin/articles/articles.component';
import { RegisterComponent } from './auth/register/register.component';
import { adminGuard } from './guards/admin-guard';
import { MainViewComponent } from './main-view/main-view.component';
export const routes: Routes = [
  {
    path: '',
    component: MainViewComponent // <- STRONA GŁÓWNA
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // {
  //   path: 'reset-hasla',
  //   component: PasswordResetComponent,
  //   title: 'Resetowanie hasła'
  // },
  // {
  //   path: 'zmiana-hasla',
  //   component: PasswordChangeComponent,
  //   title: 'Zmiana hasła'
  // },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/article',
    component: AdminArticlesComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/article/:id',
    component: AdminArticlesComponent,
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];