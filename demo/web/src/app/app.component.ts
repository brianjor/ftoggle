import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FToggle } from '@ftoggle/clients-web';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private fToggle = new FToggle({
    apiToken: 'testId:dev:dc603a94-f649-425b-a452-0ed27ceae84e',
    baseUrl: 'http://localhost:8080',
    refreshInterval: 5,
  });
  isFeatureEnabled = signal(false);
  apiResponse = signal('');

  constructor(private http: HttpClient) {
    this.fToggle.on('changed', () =>
      this.isFeatureEnabled.set(this.fToggle.isEnabled('feature')),
    );
  }

  pingApi() {
    this.http.get('/demo').subscribe((data) => {
      console.log(data);
      this.apiResponse.set((data as unknown as { data: string }).data);
    });
  }
}
