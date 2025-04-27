// menu.component.ts
import { Component, signal, computed, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { doc, docData } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Article, ConstructionStep } from '../models/menu.interface';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class ConstructionMenuComponent {
  @Output() stepSelected = new EventEmitter<ConstructionStep>();
  firestore = inject(Firestore);

  steps$: Observable<ConstructionStep[]> = of([]);

  steps(): ConstructionStep[] {
    return [
      {
        id: '1',
        title: 'Foundation',
        order: 1,
        articleId: 'article-1',
        children: ['Excavation', 'Concrete Pouring'],
        checklist: [
          { id: 1, text: 'Excavation completed', checked: true },
          { id: 2, text: 'Concrete poured', checked: false }
        ],
        completed: false
      },
      {
        id: '2',
        title: 'Framing',
        order: 2,
        articleId: 'article-2',
        children: ['Walls', 'Roof'],
        checklist: [
          { id: 3, text: 'Walls built', checked: false },
          { id: 4, text: 'Roof installed', checked: false }
        ],
        completed: false
      }
    ];
  }

  // Sygnał przechowujący aktualnie otwarty krok
  activeStepIndex = signal<number | null>(null);

  // Przełączanie widoczności kroku
  toggleStep(index: number): void {
    this.activeStepIndex.set(this.activeStepIndex() === index ? null : index);
  }

  // Wybór konkretnego kroku
  selectStep(step: ConstructionStep): void {
    this.stepSelected.emit(step);
  }

  // Dynamiczne klasy dla nagłówka kroku
  getStepHeaderClass(step: ConstructionStep, index: number): string {
    const baseClasses = 'p-2 rounded transition-colors duration-200 cursor-pointer';
    const isActive = this.activeStepIndex() === index;
    const isCompleted = step.completed;

    if (isActive) {
      return `${baseClasses} bg-blue-50 border border-blue-200 ${isCompleted ? 'text-green-600' : 'text-gray-800'
        }`;
    }

    return `${baseClasses} hover:bg-gray-50 ${isCompleted ? 'text-green-600' : 'text-gray-800'
      }`;
  }
}