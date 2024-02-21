import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  getCookie(name: string) {
    // https://stackoverflow.com/a/21125098
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) {
      return match[2];
    }
    return '';
  }

  isSignedIn() {
    return this.getCookie('signedIn') === 'yes';
  }
}
