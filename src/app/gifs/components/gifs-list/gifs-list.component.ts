import { Component, input } from '@angular/core';
import GifsListItemComponent from '../gifs-list-item/gifs-list-item.component';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-list',
  imports: [ GifsListItemComponent],
  templateUrl: './gifs-list.component.html',
})
export default class GifsListComponent {
  title: string = 'Gifs List'
  
  gifs = input.required<Gif[]>();
  // mostrar los gifs en consola
  ngOnChanges() {
    console.log(this.gifs());
  }

}