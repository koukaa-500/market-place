import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/AuthService/auth-service.service';
import { User } from 'src/app/UserService/User';
import { UserService } from 'src/app/UserService/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: User | null = null; 
  userRole: string = ''; 

  constructor(private authService: AuthServiceService, private router: Router,    private userService: UserService,  ) {     }

  ngOnInit(): void {
    this.loadUserProfile();
        const role = localStorage.getItem('userRole');
    this.userRole = role ? role : '';
  

  }
  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  toggleSubmenu(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.toggle('show_submenu');
  }
  
  // Logout function
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
