// article.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article',
  standalone: true,
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
  @Input() content: string = '';
}