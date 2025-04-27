import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc, addDoc, collection } from '@angular/fire/firestore';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-admin-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './articles.component.html'
})
export class AdminArticlesComponent implements OnInit {
  firestore = inject(Firestore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  id: string | null = null;
  title = '';
  content = '';

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const docRef = doc(this.firestore, `articles/${this.id}`);
      const snap = await getDoc(docRef);
      const data = snap.data();
      if (data) {
        this.title = data['title'];
        this.content = data['content'];
      }
    }
  }

  async save() {
    if (!this.title.trim()) {
      alert('Tytuł jest wymagany');
      return;
    }

    const article = {
      title: this.title,
      content: this.content,
      updatedAt: new Date()
    };

    if (this.id) {
      await setDoc(doc(this.firestore, `articles/${this.id}`), article, { merge: true });
    } else {
      const articlesRef = collection(this.firestore, 'articles');
      await addDoc(articlesRef, {
        ...article,
        createdAt: new Date()
      });
    }

    alert('Zapisano ✅');
    this.router.navigate(['/admin']);
  }
}
