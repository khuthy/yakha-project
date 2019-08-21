import { Http} from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';



/*
  Generated class for the CoordsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CoordsProvider {
  apiKey = 'd888fea3671eaa6aa3d1e679b8283005';
  apiKey2 = '4d1f7e20b86245f897b5a065d1c45f42';
  location : string ;
  constructor(public http: Http) {
    console.log('Hello WeatherProvider Provider');

  }

  currentWeather(): Observable<any> {
    const currentInfo = this.http.get(`http://api.openweathermap.org/data/2.5/weather?Soweto=za&units=metric&APPID=d888fea3671eaa6aa3d1e679b8283005`).map(res => res.json());


        return currentInfo;
      };
      currentWeatherNKR(): Observable<any> {
        const currentInfo = this.http.get(`http://api.openweathermap.org/data/2.5/weather?q=Ladysmith,za&units=metric&APPID=${this.apiKey}`).map(res => res.json());


            return currentInfo;
          };
          currentWeatherDBN(latitude, longitude): Observable<any> {

            const currentInfo = this.http.get(`http://api.openweathermap.org/data/2.5/weather?lat=`+latitude+`&lon=`+longitude+`&units=metric&APPID=${this.apiKey}`).map(res => res.json());


                return currentInfo;
              };
              currentNews(): Observable<any> {
                const currentInfo = this.http.get(`https://newsapi.org/v2/top-headlines?country=ZA&category=entertainment&apiKey=4d1f7e20b86245f897b5a065d1c45f42`).map(res => res.json());


                    return currentInfo;
                  };

                  Movie(): Observable<any> {
                    const currentInfo = this.http.get(`http://www.omdbapi.com/?apikey=5909010c&t=Empire&Season=1`).map(res => res.json());

                    return currentInfo;
                  }
  }
