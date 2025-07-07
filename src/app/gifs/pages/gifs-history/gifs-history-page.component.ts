import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GifService } from '../../services/gifs.service';
import GifsListComponent from "../../components/gifs-list/gifs-list.component";

@Component({
  selector: 'gifs-history-page',
  imports: [GifsListComponent],
  templateUrl: './gifs-history-page.component.html',
})
export default class GifsHistoryComponent {
  gifService = inject(GifService)

  query = toSignal(inject(ActivatedRoute).params.pipe( // lo de adentro del parentesis sera un observable, emitira valores a medida que el url cambie
    map( params => params['query']) // query es el nombre de la ruta definido en appRoutes
  ))

  gifsByKey = computed(() => this.gifService.getHistoryGif(this.query()))

}

// ActivatedRoute es la ruta activa, params son los parametros o la key de esa ruta
// toSignal transforma un observable en una senial
// Cualquier observable tiene el metodo pipe y nos permite poder conectarle los operadores de rxjs como el map