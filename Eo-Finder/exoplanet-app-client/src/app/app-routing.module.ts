// AppRoutingModule
// This module defines the application routes.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuard } from './services/auth.gard';
import { EditDetailsComponent } from './pages/edit-details/edit-details.component';
import { RevisionNotesComponent } from './pages/revision-notes/revision-notes.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'edit-profile', component: EditDetailsComponent, canActivate: [AuthGuard] },
  { path: 'revision-notes/:deckId', component: RevisionNotesComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
