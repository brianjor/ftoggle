import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { paths } from '../app.routes';
import { CookieService } from '../services/cookie.service';

export const isSignedIn: CanActivateFn = () => {
  const isSignedIn = inject(CookieService).isSignedIn();
  if (!isSignedIn) {
    console.info('User is not signed in. Redirecting to login page');
    const router = inject(Router);
    router.navigate([paths.login]);
    return false;
  }
  return true;
};
