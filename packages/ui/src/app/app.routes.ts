import { Routes } from '@angular/router';
import { isSignedIn } from './guards/isSignedIn';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const paths = {
  login: 'login',
  projects: 'projects',
};

export const routes: Routes = [
  { path: paths.login, component: LoginComponent },
  {
    path: paths.projects,
    component: ProjectsComponent,
    canActivate: [isSignedIn],
  },
  { path: '**', component: PageNotFoundComponent },
];
