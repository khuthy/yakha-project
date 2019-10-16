import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { ProfileComponent } from './profile/profile';
import { DescriptionComponent } from './description/description';
import { PasswordResetComponent } from './password-reset/password-reset';
@NgModule({
	declarations: [GoogleMapComponent,
    ProfileComponent,
    DescriptionComponent,
    PasswordResetComponent],
	imports: [],
	exports: [GoogleMapComponent,
    ProfileComponent,
    DescriptionComponent,
    PasswordResetComponent]
})
export class ComponentsModule {}
