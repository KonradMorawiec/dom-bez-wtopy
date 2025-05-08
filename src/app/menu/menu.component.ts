import { Component, signal, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { ConstructionStep } from '../models/menu.interface';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class ConstructionMenuComponent implements OnInit {
  @Output() stepSelected = new EventEmitter<ConstructionStep>();
  private firestore = inject(Firestore);

  // Observable with steps from Firestore
  steps$: Observable<ConstructionStep[]>;

  constructor() {
    // Reference to your Firestore collection
    const stepsCollection = collection(this.firestore, 'menus');

    // Get data with document IDs
    this.steps$ = collectionData(stepsCollection, { idField: 'RJOKRLzzyOKPnJtVODPz' }).pipe(
      map(steps => {
        const activeStep = steps.find(step => step['isActive']); // Find the active step
        return activeStep ? activeStep['items'] : []; // Return its 'items' or an empty array if no active step
      })
    );
  }

  ngOnInit() {
    // Initialize the active step index to the first step
    this.steps$.subscribe(steps => {
      if (steps.length > 0) {
        this.activeStepIndex.set(0);
      }
      console.warn('Steps:', steps);
    });
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

  print(data): void {
    console.log('Print: ', data);
  }
}