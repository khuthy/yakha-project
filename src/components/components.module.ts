import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { ProfileComponent } from './profile/profile';
import { DescriptionComponent } from './description/description';
@NgModule({
	declarations: [GoogleMapComponent,
    ProfileComponent,
    DescriptionComponent],
	imports: [],
	exports: [GoogleMapComponent,
    ProfileComponent,
    DescriptionComponent]
})
export class ComponentsModule {}
