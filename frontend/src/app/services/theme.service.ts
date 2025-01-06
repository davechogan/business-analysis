import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Set initial theme
      this.setDarkMode(prefersDark.matches);

      // Listen for system theme changes
      prefersDark.addEventListener('change', (e) => {
        this.setDarkMode(e.matches);
      });
    }
  }

  private setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }
} 