  import { Component, OnInit } from '@angular/core';
  import { UserService } from '../UserService/user.service';
  import { User, Category } from '../UserService/User';
  import Swal from 'sweetalert2';

  @Component({
    selector: 'app-getemployee',
    templateUrl: './getemployee.component.html',
    styleUrls: ['./getemployee.component.css']
  })
  export class GetemployeeComponent implements OnInit {
    employees: User[] = [];
    originalEmployees: User[] = [];
    selectedEmployee: User | null = null; // Initialiser comme null
    isPopupOpen = false;
    searchText: string = '';
    selectedRole: string = '';
    selectedStatus: string = '';
    selectedDate: string = '';
    isUpdateModalOpen: boolean = false;
    isUpdatePopupOpen = false; // Nom de variable corrigé
    roles: string[] = ['SOCIETE_EMPLOYEE', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 'PROMOTION_MANAGER']; // Ajouter plus de rôles si nécessaire
    selectedFile: File | null = null; // Pour gérer les téléchargements de fichiers

    constructor(private userService: UserService) {}

    ngOnInit(): void {

      // Assurez-vous que selectedEmployee est initialisé avec des valeurs par défaut
      this.selectedEmployee = {
        id: 0,
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        role: 'EMPLOYE_SOCIETE', // Rôle par défaut (peut être modifié dynamiquement)
        active: true, // Statut par défaut
        image: '',
        registrationDate: null,
        verificationCode: '',
        verificationCodeExpiry: null,
        categories: [],
        employees:[], // Initialiser comme un tableau vide
        societe: null // Ajuster selon votre modèle Societe
      };
      
      this.fetchEmployees();
    }
    fetchEmployees(): void {
      this.userService.getEmployeesForSociete().subscribe({
        next: (data) => {
          this.originalEmployees = data; // Store the original data
          this.employees = [...this.originalEmployees]; // Initialize the displayed data
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des employés:', error);
        }
      });
    }
    applyFilters(): void {
      this.employees = this.originalEmployees.filter((employee) => {
        const matchesText =
          this.searchText === '' ||
          employee.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
          employee.email.toLowerCase().includes(this.searchText.toLowerCase());
  
        const matchesRole =
          this.selectedRole === '' || employee.role === this.selectedRole;
  
        const matchesStatus =
          this.selectedStatus === '' || String(employee.active) === this.selectedStatus;
  
        const matchesDate =
          this.selectedDate === '' || employee.registrationDate === this.selectedDate;
  
        return matchesText && matchesRole && matchesStatus && matchesDate;
      });
    }
    openPopup(employee: User): void {
      this.selectedEmployee = { ...employee }; // Créer une copie de l'employé sélectionné
      this.isPopupOpen = true;
    }

    openUpdatePopup(employee: User): void {
      this.selectedEmployee = { ...employee }; // Créer une copie pour éviter de modifier l'original
      this.isUpdatePopupOpen = true;
    }

    closePopup(): void {
      this.isPopupOpen = false;
      this.isUpdatePopupOpen = false;
      this.selectedEmployee = null;
      this.selectedFile = null;
    }

    updateEmployeeDetails(): void {
      if (this.selectedEmployee) {
        this.userService.updateUser(this.selectedEmployee.id, this.selectedEmployee).subscribe({
          next: (response) => {
            if (this.selectedFile) {
              this.updateEmployeeImage();
            } else {
              this.handleUpdateSuccess();
            }
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            Swal.fire({
              icon: 'error',
              title: 'Échec de la mise à jour',
              text: 'Impossible de mettre à jour les informations de l\'utilisateur. Veuillez réessayer.'
            });
          }
        });
      }
    }

    private updateEmployeeImage(): void {
      if (this.selectedEmployee && this.selectedFile) {
        this.userService.updateUserImage(this.selectedEmployee.id, this.selectedFile).subscribe({
          next: (updatedUser) => {
            this.selectedEmployee!.image = updatedUser.image; // Mettre à jour l'image localement
            this.handleUpdateSuccess();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'image:', error);
            Swal.fire({
              icon: 'error',
              title: 'Échec de la mise à jour de l\'image',
              text: 'Impossible de mettre à jour l\'image de l\'utilisateur. Veuillez réessayer.'
            });
          }
        });
      }
    }

    private handleUpdateSuccess(): void {
      this.closePopup();
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur mis à jour',
        text: 'Les informations de l\'utilisateur ont été mises à jour avec succès!',
        confirmButtonText: 'OK'
      }).then(() => {
        this.fetchEmployees(); // Rafraîchir la liste des employés
      });
    }

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0]; // Sauvegarder le fichier sélectionné
      }
    }
    deleteEmployee(employeeId: number): void {
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Vous ne pourrez pas annuler cette action !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer !'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.deleteUser(employeeId).subscribe({
            next: () => {
              Swal.fire(
                'Supprimé !',
                'L\'employé a été supprimé avec succès.',
                'success'
              );
              this.fetchEmployees(); // Rafraîchir la liste des employés
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de l\'employé:', error);
              Swal.fire({
                icon: 'error',
                title: 'Échec de la suppression',
                text: 'Impossible de supprimer l\'employé. Veuillez réessayer.'
              });
            }
          });
        }
      });
    }
  }    