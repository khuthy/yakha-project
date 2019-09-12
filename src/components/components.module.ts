import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { ProfileComponent } from './profile/profile';
@NgModule({
	declarations: [GoogleMapComponent,
    ProfileComponent],
	imports: [],
	exports: [GoogleMapComponent,
    ProfileComponent]
})
export class ComponentsModule {}
