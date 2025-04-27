// main-view.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleComponent } from '../article/article.component';
import { QuillModule } from 'ngx-quill';
import { ConstructionMenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule, ConstructionMenuComponent, ArticleComponent, QuillModule],
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent {
  activeTab = signal<'article' | 'checklist'>('article');
  currentStepContent = signal<string>('Wybierz etap z menu po lewej stronie');
  checklistItems = signal<ChecklistItem[]>([
    { id: 1, text: 'Sprawdź MPZP działki', checked: false },
    { id: 2, text: 'Weryfikacja księgi wieczystej', checked: true },
    { id: 3, text: 'Badanie nośności gruntu', checked: false }
  ]);

  toggleChecklistItem(id: number): void {
    this.checklistItems.update(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }
}

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}