import { HttpClient } from '@angular/common/http'
import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { environment } from '@environments/environment'
import type { GiphyResponse } from '../interfaces/giphy.interfaces'
import { Gif } from '../interfaces/gif.interface'
import { GifMapper } from '../mapper/gif.mapper'
import { map, tap } from 'rxjs'

const GIF_KEY = 'gifs'

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}' // Record<string, Gif[]>
  return JSON.parse(gifsFromLocalStorage)
}

@Injectable({ providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient)

  trendingGifs = signal<Gif[]>([])
  trendingGifsLoading = signal(true)

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage()) // Record crea un tipo de dato clave valor
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory())) // se computa cada vez que searchHistory cambia

  constructor() {
    this.loadTrendingGifs()
  }

  saveGifsToLocalStorage = effect(() => { // el effect se dispara cuando cambia searchHistory
    const historyString = JSON.stringify(this.searchHistory())
    localStorage.setItem(GIF_KEY, historyString)
  })

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key:environment.giphyApiKey,
        limit:20,
        rating:'g'
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
      this.trendingGifs.set(gifs)
      this.trendingGifsLoading.set(false)
    })
  }

  searchGifs(query: string) {
    console.log(query)
    // retorna un observable de tipo GiphyResponse, me permite subscribirme en el componente que usa este servicio
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key:environment.giphyApiKey,
        q:query,
        limit:20,
        offset:0,
        rating:'g',
        lang:'en'
      }
      // pipe para encadenar operadores de RxJs, permite aplicar una secuencia 
      // de transformaciones a los datos emitidos por el observable resultante de la llamada http.
    }).pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

        // historial
        tap((items) => { // tap sirve para disparar eventos secundarios
          this.searchHistory.update( history => ({
            ...history,
            [query.toLowerCase()]: items
          }))
        })
      )

    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
    //   this.respGifs.set(gifs)
    // })
  }

  getHistoryGif(query:string): Gif[] {
    return this.searchHistory()[query] ?? [];
  } 
}

// Apunte: para que las peticiones http se ejecuten es necesario subscribirse
// en este caso me subscribo directamente en el componente donde se importa y se
// este servicio y no como la porcion de codigo que esta comentado en la linea 64
// ( esto se usa en el componente search-page.component.ts)