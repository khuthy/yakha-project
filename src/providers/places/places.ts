import { Place } from './../../pages/modal/Place';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the PlacesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlacesProvider {
  private places : Place[] = [];

  constructor(public http: HttpClient) {
  //  console.log('Hello PlacesProvider Provider');
  }

  addPlaces(place: Place) {
    this.places.push(place);
   // this.storage.set('places', this.places);

  }
  getPlaces(){
      return this.places.slice();
  }

}
