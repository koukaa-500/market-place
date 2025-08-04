import { Component } from '@angular/core';
import { AuthServiceService } from '../AuthService/auth-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponent {
  registerRequest = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private authService: AuthServiceService,private route: Router) {}

  register(registerForm: any) {
    // Initialize the error message
    let errorMessage = '';
  
    if (registerForm.valid) {
      // Proceed with the API request if the form is valid
      this.authService.register(this.registerRequest).subscribe(
        response => {
          // Show success Swal message
          Swal.fire({
            title: 'Inscription réussie',
            text: 'Veuillez vérifier votre email pour activer votre compte.',
            icon: 'success',
            confirmButtonText: 'Ok',
     
            confirmButtonColor: '#08639c'
            
          });
          this.route.navigate(['verify']);
        },
        error => {
          // Show error Swal message
          Swal.fire({
            title: 'Échec de l\'inscription',
            text: 'Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'Ok',
     
            confirmButtonColor: '#08639c'
          });
        }
      );
    } else {
      // Show specific validation errors for each field
      if (registerForm.controls.username.invalid) {
        if (registerForm.controls.username.errors?.['required']) {
          errorMessage += 'Le nom d\'utilisateur est requis. \n';
        }
      }
  
      if (registerForm.controls.email.invalid) {
        if (registerForm.controls.email.errors?.['required']) {
          errorMessage += 'L\'email est requis. \n';
        }
        if (registerForm.controls.email.errors?.['email']) {
          errorMessage += 'Veuillez entrer un email valide. \n';
        }
      }
  
      if (registerForm.controls.password.invalid) {
        if (registerForm.controls.password.errors?.['required']) {
          errorMessage += 'Le mot de passe est requis. \n';
        }
        if (registerForm.controls.password.errors?.['minlength']) {
          errorMessage += 'Le mot de passe doit contenir au moins 6 caractères. \n';
        }
      }
  
      // Show the detailed error message
      if (errorMessage) {
        Swal.fire({
          title: 'Erreur de validation',
          text: errorMessage.trim(),
          icon: 'error',
          confirmButtonText: 'Ok',
     
          confirmButtonColor: '#08639c'
        });
      } else {
        // In case there are no specific errors, show a general validation error
        Swal.fire({
          title: 'Erreur de validation',
          text: 'Veuillez corriger les erreurs dans le formulaire.',
          icon: 'error',
          confirmButtonText: 'Ok',
     
          confirmButtonColor: '#08639c'
        });
      }
    }
  }
  
  

  oauth2Login(provider: string): void {
    this.authService.oauth2Login(provider);
  }
}
