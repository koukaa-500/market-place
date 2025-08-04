import { Component, OnInit } from '@angular/core';
import { SocieteService } from '../Societeservices/societe.service';
import { Societe } from '../UserService/Societe';
import { User } from '../UserService/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-societes',
  templateUrl: './societes.component.html',
  styleUrls: ['./societes.component.css'],
})
export class SocietesComponent implements OnInit {
  societes: User[] = [];
  isEditModalOpen = false;
  isCreateModalOpen=false;
  isEmployeeModalOpen = false;
  selectedUser: User | null = null;

  societeUsers: any[] = []; // List of societe users
  societeEmployees: { [key: number]: any[] } = {}; // Map of societeId to employees
  expandedIndex: number | null = null;
  editUserForm: FormGroup;
  createSocieteForm: FormGroup;

  constructor(private fb: FormBuilder, private societeService: SocieteService) {
    this.createSocieteForm = this.fb.group({
      societeName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    });
    this.editUserForm = this.fb.group({
      societeName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.getSocieteUsers();
    this.loadScript('assets/js/jquery.min.js');
    this.loadScript('assets/js/popper.js');
    this.loadScript('assets/js/bootstrap.min.js');
    this.loadScript('assets/js/main.js');
  }
  private loadScript(scriptUrl: string): void {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);
  }
  onCreateSocieteSubmit(): void {
    if (this.createSocieteForm.valid) {
      console.log('Form Data:', this.createSocieteForm.value); // Check what data is being sent
      this.societeService.createSociete(this.createSocieteForm.value).subscribe(
        (response) => {
          console.log('Société créée avec succès:', response);
          Swal.fire('Succès', 'La société a été créée avec succès !', 'success');
          this.getSocieteUsers(); // Refresh the list
          this.closeCreateModal();
        },
        (error) => {
          console.error('Erreur lors de la création de la société:', error);
          Swal.fire('Erreur', 'La création de la société a échoué.', 'error');
        }
      );
    } else {
      Swal.fire('Attention', 'Veuillez remplir correctement tous les champs obligatoires.', 'warning');
    }
  }
  
  getSocieteUsers(): void {
    this.societeService.getAllSocieteUsers().subscribe(
      (data: User[]) => {
        console.log('Sociétés récupérées :', data);
        this.societes = data; // Store the fetched sociétés and their employees
      },
      (error) => {
        console.error('Erreur lors de la récupération des sociétés :', error);
        Swal.fire('Erreur', 'Échec du chargement des sociétés et des employés.', 'error');
      }
    );
  }
  


  getEmployees(societeId: number): void {
    this.societeService.getSocieteEmployees(societeId).subscribe(employees => {
      this.societeEmployees[societeId] = employees;
    });
  }



  viewUserDetails(id: number): void {
    this.societeService.getSocieteUserById(id).subscribe(
      (user) => {
        this.selectedUser = user;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimez-la !',
      cancelButtonText: 'Non, annulez !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.societeService.deleteSocieteUser(id).subscribe(
          () => {
            console.log(`Société avec l'ID ${id} supprimée`);
  
            this.getSocieteUsers();
            Swal.fire('Supprimée !', 'La société a été supprimée.', 'success');
          },
          (error) => {
            console.error('Erreur lors de la suppression de la société :', error);
            Swal.fire('Erreur !', 'Une erreur s\'est produite lors de la suppression de la société.', 'error');
          }
        );
      } else {
        Swal.fire('Annulé', 'La société est en sécurité :)', 'info');
      }
    });
  }
  
  onSubmit(): void {
    if (this.editUserForm.valid && this.selectedUser) {
      const updatedSociete: User = {
        ...this.selectedUser,
        name: this.editUserForm.value.societeName,
        email: this.editUserForm.value.email,
        phone: this.editUserForm.value.phone,
        address: this.editUserForm.value.address,
        city: this.editUserForm.value.city,
        postalCode: this.editUserForm.value.postalCode,
      };
  
      this.societeService.updateSocieteUser(updatedSociete.id, updatedSociete).subscribe(
        (response) => {
          console.log('Société mise à jour avec succès:', response);
          Swal.fire('Succès', 'La société a été mise à jour avec succès !', 'success');
          this.getSocieteUsers(); // Refresh the list
          this.closeEditModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la société:', error);
          Swal.fire('Erreur', 'La mise à jour de la société a échoué.', 'error');
        }
      );
    } else {
      Swal.fire('Attention', 'Veuillez remplir correctement tous les champs obligatoires.', 'warning');
    }
  }
  selectUser(user: User): void {
    this.selectedUser = user;
  }
  openEditModal(user: User): void {
    this.selectedUser = user;
  
    // Populate the form with selected user data
    this.editUserForm.patchValue({
      societeName: user.name,
      email: user.email,
      password: '', // Leave blank for security
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
    });
  
    this.isEditModalOpen = true;
  }
  
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedUser = null;
    this.editUserForm.reset();
  }
  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }
  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.editUserForm.reset();
  }

  toggleUserActiveStatus(id: number, newStatus: boolean): void {
    this.societeService.updateUserActiveStatus(id, newStatus).subscribe(
      (updatedUser: User) => {
        // Mettre à jour le statut actif dans le tableau local des sociétés
        const societe = this.societes.find(s => s.id === id);
        if (societe) {
          societe.active = updatedUser.active; // Supposons que le champ `active` soit utilisé dans le modèle User
        }
        Swal.fire('Succès', `Le statut de la société a été mis à jour en ${newStatus ? 'actif' : 'inactif'}.`, 'success');
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut de la société :', error);
        Swal.fire('Erreur', 'Échec de la mise à jour du statut de la société.', 'error');
      }
    );
  }
  

  // Toggle the visibility of the employees list
  toggleEmployeesList(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

}
