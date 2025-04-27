// construction-step-form.component.ts
import { collectionData } from '@angular/fire/firestore';
import { collection, getDoc, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ConstructionStepFormComponent {
  // Dodaj to do istniejącej klasy
  articles$: Observable<Article[]>;
  selectedArticleId?: string;

  constructor(/* ... */) {
    const articlesRef = collection(this.firestore, 'articles');
    this.articles$ = collectionData(articlesRef, { idField: 'id' }) as Observable<Article[]>;
  }

  async loadStepData(id: string) {
    const stepDoc = await getDoc(doc(this.firestore, `construction-steps/${id}`));
    const stepData = stepDoc.data() as ConstructionStep;

    this.stepForm.patchValue({
      title: stepData.title,
      order: stepData.order,
      children: stepData.children.join('\n'),
      completed: stepData.completed
    });

    this.selectedArticleId = stepData.articleId;
  }

  async onSubmit() {
    // ... istniejący kod

    if (this.selectedArticleId) {
      await this.constructionService.linkStepWithArticle(
        this.isEditMode ? this.stepId! : newStepRef.id,
        this.selectedArticleId
      );
    }
  }
}