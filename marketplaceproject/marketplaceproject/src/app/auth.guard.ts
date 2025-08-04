import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthServiceService } from './AuthService/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/notfound']); // Redirect to Not Found page
      return false;
    }

    // Retrieve required roles from route data
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = this.authService.getRole(); // Assuming this returns an array of roles
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        this.router.navigate(['/notfound']); // Redirect if the user lacks the required role
        return false;
      }
    }

    return true; // Allow access if logged in and has required role
  }
}
