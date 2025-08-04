import { Component } from '@angular/core';
import { AuthServiceService } from '../AuthService/auth-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponent {
  loginRequest = { email: '', password: '' };

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) { }

  login(): void {
    if (!this.loginRequest.email || !this.loginRequest.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs requis.',
        confirmButtonText: 'OK',
     
        confirmButtonColor: '#08639c'
      });
      return;
    }

    this.authService.authenticate(this.loginRequest).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie !',
          text: 'Bienvenue sur votre tableau de bord.',
          confirmButtonText: 'OK',
     
          confirmButtonColor: '#08639c'
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error => {
        if (error.error && error.error.includes('Email not found')) {
          Swal.fire({
            icon: 'error',
            title: 'Email non trouvé',
            text: 'Veuillez vérifier votre email et réessayer.',
            confirmButtonText: 'Réessayer',
     
            confirmButtonColor: '#08639c'
          });
        } else if (error.error && error.error.includes('Invalid password')) {
          Swal.fire({
            icon: 'error',
            title: 'Mot de passe incorrect',
            text: 'Veuillez vérifier votre mot de passe et réessayer.',
            confirmButtonText: 'Réessayer',
     
            confirmButtonColor: '#08639c'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Échec de la connexion',
            text: 'Veuillez vérifier votre email et mot de passe et réessayer.',
            confirmButtonText: 'Réessayer',
     
            confirmButtonColor: '#08639c'
          });
        }
      }
    );
  }

  oauth2Login(provider: string): void {
    this.authService.oauth2Login(provider);
  }
}
