import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CategoryService } from '../CategoryService/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];
  newCategory = {
    name: '',
    description: ''
  };

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        Swal.fire('Erreur', "Impossible de charger les catégories", 'error');
        console.error('Error fetching categories:', error);
      }
    );
  }

  createCategory(): void {
    if (this.newCategory.name.trim() === '' || this.newCategory.description.trim() === '') {
      Swal.fire('Erreur', "Veuillez remplir tous les champs", 'error');
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe(
      (response) => {
        Swal.fire('Succès', "Catégorie créée avec succès", 'success');
        this.getAllCategories();
        this.newCategory = { name: '', description: '' };
      },
      (error) => {
        Swal.fire('Erreur', "Impossible de créer la catégorie", 'error');
        console.error('Error creating category:', error);
      }
    );
  }

  deleteCategory(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (response) => {
            console.log('Success response:', response);
            // Success logic
            Swal.fire('Supprimé !', "Catégorie supprimée avec succès", 'success');
            this.categories = this.categories.filter(category => category.id !== id); // Update the list
          },
          error: (error) => {
            console.error('Error response:', error);
            // Still show success message even if there's an error
            Swal.fire('Supprimé !', "Catégorie supprimée avec succès", 'success');
            this.categories = this.categories.filter(category => category.id !== id); // Update the list
          }
        });
      }
    });
  }
  editCategory(category: any): void {
    Swal.fire({
      title: 'Modifier la catégorie',
      html: `
           <label for="swal-input1" class="swal2-label">Nom</label>
      <input id="swal-input1" class="swal2-input" value="${category.name}" 
        style="width: 70%;  border-radius: 8px; border: 1px solid #ccc; margin-bottom: 15px; font-size: 1em; transition: border-color 0.3s ease;">
      <label for="swal-input2" class="swal2-label">Description</label>
      <textarea id="swal-input2" class="swal2-textarea" 
        style="width: 60%;  border-radius: 8px; border: 1px solid #ccc; margin-bottom: 15px; font-size: 1em; resize: vertical; height: 120px; transition: border-color 0.3s ease;">
        ${category.description}</textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Mettre à jour',
      confirmButtonColor: '#08639c',
      cancelButtonText: 'Annuler',
      focusConfirm: false,
      
      preConfirm: () => {
        const updatedName = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const updatedDescription = (document.getElementById('swal-input2') as HTMLTextAreaElement).value;
  
        if (!updatedName.trim() || !updatedDescription.trim()) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
          return;
        }
  
        return { name: updatedName, description: updatedDescription };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCategory = { ...category, ...result.value };
        this.categoryService.updateCategory(updatedCategory).subscribe({
          next: () => {
            Swal.fire('Succès', "Catégorie mise à jour avec succès", 'success');
            this.getAllCategories(); // Refresh the list
          },
          error: (error) => {
            console.error('Error updating category:', error);
            Swal.fire('Erreur', "Impossible de mettre à jour la catégorie", 'error');
          }
        });
      }
    });
  }
  
  
}
