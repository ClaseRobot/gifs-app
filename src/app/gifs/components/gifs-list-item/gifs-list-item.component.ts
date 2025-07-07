import { Component, input } from '@angular/core';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-list-item',
  imports: [],
  templateUrl: './gifs-list-item.component.html',
})
export default class GifsListItemComponent {
  title: string = 'Gifs List Item'
  gif = input.required<Gif>()
}