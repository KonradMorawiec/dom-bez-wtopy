import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConstructionService {
  constructor(private firestore: Firestore) { }

  // Powiąż etap z artykułem
  async linkStepWithArticle(stepId: string, articleId: string): Promise<void> {
    const stepRef = doc(this.firestore, `construction-steps/${stepId}`);
    const articleRef = doc(this.firestore, `articles/${articleId}`);

    // Aktualizujemy oba dokumenty
    await updateDoc(stepRef, { articleId });
    await updateDoc(articleRef, { stepId });
  }

  // Pobierz artykuł powiązany z etapem
  async getArticleForStep(stepId: string): Promise<Article | null> {
    const stepDoc = await getDoc(doc(this.firestore, `construction-steps/${stepId}`));
    const stepData = stepDoc.data() as ConstructionStep;

    if (stepData.articleId) {
      const articleDoc = await getDoc(doc(this.firestore, `articles/${stepData.articleId}`));
      return articleDoc.data() as Article;
    }
    return null;
  }

  // Pobierz etap powiązany z artykułem
  async getStepForArticle(articleId: string): Promise<ConstructionStep | null> {
    const articleDoc = await getDoc(doc(this.firestore, `articles/${articleId}`));
    const articleData = articleDoc.data() as Article;

    if (articleData.stepId) {
      const stepDoc = await getDoc(doc(this.firestore, `construction-steps/${articleData.stepId}`));
      return stepDoc.data() as ConstructionStep;
    }
    return null;
  }
}