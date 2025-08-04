import { Component } from '@angular/core';
import { User } from '../UserService/User';
import { UserService } from '../UserService/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent {
  newUser: Partial<User> = {
    username: '',
    password: '',
    email: '',
    address: '',
    phone: '', // Add phone field
    role: 'SOCIETE_EMPLOYEE', // Default role for new users
  };

  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  createUser(): void {
    this.userService.createUser(this.newUser as User).subscribe(
      (response) => {
        console.log('Utilisateur créé avec succès:', response);
        // Swal success alert in French
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Utilisateur créé avec succès !',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/dashboard/Employee']); // Redirect to another page after success
        });
      },
      (error) => {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        // Swal error alert in French
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de la création de l\'utilisateur. Veuillez réessayer.',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
