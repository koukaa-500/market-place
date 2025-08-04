import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../AuthService/auth-service.service';
import { CategoryService } from '../CategoryService/category.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-registre-societe',
  templateUrl: './registre-societe.component.html',
  styleUrls: ['./registre-societe.component.css']
})
export class RegistreSocieteComponent implements OnInit {
  registreForm: FormGroup = this.fb.group({}); 
  categories: any[] = [];  // This will store the available categories

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registreForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      categoryIds: [[], [Validators.required]] // This will be a list of selected category IDs
    });

    // Fetch categories from the backend
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Method to submit the form
  onSubmit(): void {
    if (this.registreForm.valid) {
      const formData = this.registreForm.value;

      // Call registerSociete service
      this.authService.registerSociete(formData).subscribe(response => {
        // Handle the response (e.g., show a success message or redirect)
        if (response.message === 'Societe registration successful. Please wait for admin approval.') {
          Swal.fire({
            title: 'Succès!',
            text: 'Inscription réussie, veuillez attendre l\'approbation de l\'administrateur.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/']); // Redirect to login or another page
        } else {
          Swal.fire({
            title: 'Échec!',
            text: 'Échec de l\'inscription : ' + response.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }, error => {
        console.error('Erreur d\'inscription:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur s\'est produite lors de l\'inscription.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    } else {
      Swal.fire({
        title: 'Formulaire invalide',
        text: 'Veuillez remplir correctement le formulaire.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}
