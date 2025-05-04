import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [CommonModule, RouterModule]
})
export class AdminComponent {
  firestore = inject(Firestore);
  router = inject(Router);

  // Zarządzanie zarówno artykułami jak i etapami budowy
  articles$: Observable<any[]>;
  constructionSteps$: Observable<any[]>;

  constructor() {
    const articlesRef = collection(this.firestore, 'articles');
    const stepsRef = collection(this.firestore, 'construction-steps');

    this.articles$ = collectionData(articlesRef, { idField: 'id' });
    this.constructionSteps$ = collectionData(stepsRef, { idField: 'id' });
  }

  goToEdit(id?: string) {
    this.router.navigate(['/admin/article', id].filter(Boolean));
  }

  goToStepEdit(id?: string) {
    this.router.navigate(['/admin/menu-editor', id].filter(Boolean));
  }

  async deleteStep(id: string) {
    if (confirm('Czy na pewno chcesz usunąć ten etap?')) {
      await deleteDoc(doc(this.firestore, `construction-steps/${id}`));
    }
  }
}