import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, FormsModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  viewMode: 'list' | 'card' = 'list';

  constructor(private router: Router) {}

  goListView(): void {
    this.router.navigate(['/tasks/list']);
  }

  goCardView(): void {
    this.router.navigate(['/tasks/card']);
  }
}
