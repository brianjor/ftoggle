import { Routes } from '@angular/router';
import { isSignedIn } from './guards/isSignedIn';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ConditionsComponent } from './pages/project/conditions/conditions.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { UsersPageComponent } from './pages/users/users-page.component';

export const paths = {
  notFound: '**',
  root: '',
  login: 'login',
  projects: 'projects',
  project: 'projects/:projectId',
  toProject: (projectId: string | number) =>
    `/${paths.project.replace(':projectId', projectId.toString())}`,
  projectFeatures: 'projects/:projectId/features',
  toProjectFeatures: (projectId: string | number) =>
    `/${paths.projectFeatures.replace(':projectId', projectId.toString())}`,
  projectConditions: 'projects/:projectId/features/:featureId/conditions',
  toProjectConditions: (projectId: string, featureId: number) =>
    `/${paths.projectConditions.replace(':projectId', projectId).replace(':featureId', String(featureId))}`,
  users: 'users',
};

export const routes: Routes = [
  { path: paths.root, redirectTo: paths.projects, pathMatch: 'full' },
  { path: paths.login, component: LoginComponent },
  {
    path: paths.projects,
    component: ProjectsComponent,
    canActivate: [isSignedIn],
  },
  {
    path: paths.project,
    component: ProjectComponent,
    canActivate: [isSignedIn],
  },
  {
    path: paths.projectConditions,
    component: ConditionsComponent,
    canActivate: [isSignedIn],
  },
  {
    path: paths.users,
    component: UsersPageComponent,
    canActivate: [isSignedIn],
  },
  { path: paths.notFound, component: PageNotFoundComponent },
];
