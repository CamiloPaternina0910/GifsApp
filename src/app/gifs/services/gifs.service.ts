import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GifsResponse, Git } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey    : string   = "9ys3zD7F2Nk8c3ljc4jOmVWVlEwa9kRE";
  private _historial: string[] = [];
  private UrlService: string   = "https://api.giphy.com/v1/gifs"
  public resultados: Git[] = [];

  constructor(private http : HttpClient){
    if(localStorage.getItem('historial')){
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }

    if(localStorage.getItem('resultados')){
      this.resultados = JSON.parse(localStorage.getItem('resultados')!)
    }
  }

  get historial() {
    return [...this._historial]
  }

  buscarGifs(query: string){
    query = query.trim().toLocaleLowerCase()
    if(this.validaciones(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10)
      localStorage.setItem('historial', JSON.stringify(this._historial));
    } 

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<GifsResponse>(`${this.UrlService}/search`, {params})
      .subscribe((response) =>{
        this.resultados = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      })
  }

  validaciones(query:string): Boolean {
    if(this._historial.includes(query) || query.trim().length == 0){
      return false;
    }
    return true;
  }
}
