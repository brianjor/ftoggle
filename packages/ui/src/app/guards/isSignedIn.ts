import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { paths } from '../app.routes';
import { LocalStorageService } from '../services/local-storage.service';

export const isSignedIn: CanActivateFn = () => {
  const isSignedIn = inject(LocalStorageService).getApiToken();
  if (isSignedIn === null) {
    console.info('User is not signed in. Redirecting to login page');
    const router = inject(Router);
    router.navigate([paths.login]);
    return false;
  }
  return true;
};
