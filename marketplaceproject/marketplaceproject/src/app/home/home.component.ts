import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthServiceService } from '../AuthService/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  @ViewChild('navbarToggler') navbarToggler!: ElementRef;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Logout function
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  // Toggle the navbar menu
  toggleNavbar(): void {
    const navbarElement = this.navbarCollapse.nativeElement;
    const isCollapsed = navbarElement.classList.contains('collapse');
    if (isCollapsed) {
      navbarElement.classList.remove('collapse');
    } else {
      navbarElement.classList.add('collapse');
    }
  }
}
