import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { paths } from '../app.routes';

export const isSignedIn: CanActivateFn = () => {
  const isSignedIn = localStorage.getItem('apiToken');
  if (isSignedIn === null) {
    console.info('User is not signed in. Redirecting to login page');
    const router = inject(Router);
    router.navigate([paths.login]);
    return false;
  }
  return true;
};
