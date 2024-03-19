import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FToggle } from '@ftoggle/clients-web';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  context = { asd: ['asd'] };
  private fToggle = new FToggle({
    apiToken: 'tp1:dev:13f614c1-be4f-4c9c-95e1-e34f0389279b',
    baseUrl: 'http://localhost:8080',
    refreshInterval: 5,
    context: this.context,
  });
  isFeatureEnabled = signal(false);
  apiResponse = signal('');

  constructor(private http: HttpClient) {
    this.fToggle.on('changed', () =>
      this.isFeatureEnabled.set(this.fToggle.isEnabled('feature')),
    );
  }

  updateAsd(event: Event) {
    const value = (event.target as unknown as { value: string }).value;
    this.context.asd = value.split(',').map((v) => v.trim());
  }

  pingApi() {
    this.http.get('/demo').subscribe((data) => {
      console.log(data);
      this.apiResponse.set((data as unknown as { data: string }).data);
    });
  }
}
