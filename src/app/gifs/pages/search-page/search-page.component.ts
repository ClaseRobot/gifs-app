import { Component, inject, signal } from '@angular/core';
import GifsListComponent from "../../components/gifs-list/gifs-list.component";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifsListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  title: string = 'Search';

  gifService = inject(GifService)
  gifs = signal<Gif[]>([])

  onSearch(query: string) {
    // me puedo subscribir al servicio aqui en lugar de en donde esta declarada la funcion
    // asi puedo setear los gifs en este componente sin tener que definir una variable en el servicio
    // y asi terminar acoplando el servicio a este componente
    this.gifService.searchGifs(query).subscribe((resp: Gif[]) => {
      this.gifs.set(resp)
    })
  }
}