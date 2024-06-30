// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// Third-party Modules
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginRegisterComponent } from './HUDs/login-register/login-register.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './HUDs/layout-navbar/layout.component';
import { EditDetailsComponent } from './pages/edit-details/edit-details.component';
import { ExoplanetHUDComponent } from './HUDs/exoplanet-hud/exoplanet-hud.component';
import { ExoplanetSearchComponent } from './HUDs/exoplanet-search/exoplanet-search.component';
import { ExoplanetDetailsComponent } from './HUDs/exoplanet-details/exoplanet-details.component';
import { RevisionNotesComponent } from './pages/revision-notes/revision-notes.component';
import { PlanetsHudComponent } from './HUDs/planets-hud/planets-hud.component';
import { PlanetCommentsComponent } from './HUDs/planet-comments/planet-comments.component';
import { PlanetsQuestionsComponent } from './HUDs/planets-questions/planets-questions.component';
import { EditDetailsHudComponent } from './HUDs/edit-details-hud/edit-details-hud.component';
import { CreateCollectionDialogComponent } from './dialogs/create-collection-dialog/create-collection-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginRegisterComponent,
    HomePageComponent,
    LayoutComponent,
    EditDetailsComponent,
    ExoplanetHUDComponent,
    ExoplanetSearchComponent,
    ExoplanetDetailsComponent,
    RevisionNotesComponent,
    PlanetsHudComponent,
    PlanetCommentsComponent,
    PlanetsQuestionsComponent,
    EditDetailsHudComponent,
    CreateCollectionDialogComponent,
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Angular Material Modules
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,

    // Routing Module
    AppRoutingModule,

    // Third-party Modules
    BsDropdownModule.forRoot(),
    NgbModule,

    // Other Modules
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }