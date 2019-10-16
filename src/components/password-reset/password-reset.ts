import { Component } from '@angular/core';

/**
 * Generated class for the PasswordResetComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'password-reset',
  templateUrl: 'password-reset.html'
})
export class PasswordResetComponent {

  text: string;

  constructor() {
    console.log('Hello PasswordResetComponent Component');
    this.text = 'Hello World';
  }

}
