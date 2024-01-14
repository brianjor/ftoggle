import { Routes } from '@angular/router';
import { isSignedIn } from './guards/isSignedIn';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProjectFeaturesComponent } from './pages/project-features/project-features.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const paths = {
  notFound: '**',
  login: 'login',
  projects: 'projects',
  projectFeatures: 'projects/:projectId/features',
  toProjectFeatures: (projectId: string | number) =>
    `/${paths.projectFeatures.replace(':projectId', projectId.toString())}`,
};

export const routes: Routes = [
  { path: paths.login, component: LoginComponent },
  {
    path: paths.projects,
    component: ProjectsComponent,
    canActivate: [isSignedIn],
  },
  {
    path: paths.projectFeatures,
    component: ProjectFeaturesComponent,
    canActivate: [isSignedIn],
  },
  { path: paths.notFound, component: PageNotFoundComponent },
];
