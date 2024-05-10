import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ErrorStateMatcher,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { DirtyOrTouchedStateMatcher } from './guards/dirtyOrTouchedErrorStateMatcher';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideNativeDateAdapter(),
    {
      provide: ErrorStateMatcher,
      useClass: DirtyOrTouchedStateMatcher,
    },
  ],
};
