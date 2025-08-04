import { Component, OnInit } from '@angular/core';
import { Product } from '../servicesProduct/Product';
import { ProductService } from '../servicesProduct/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceService } from '../AuthService/auth-service.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit{
  productForm!: FormGroup;
  hasCreatePermission: boolean = false;
  product: Product = {
    id: 0,
    name: '',
    description: '',
    typeP:'',
    price: 0,
    quantity: 0,
    category: null,
    attributes: [],
    user: {
      id: 0,
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      role: '',
      active: false,
      image: '',
      registrationDate: null,
      verificationCode: '',
      verificationCodeExpiry: null,
      categories: [],
      employees:[],
      societe: null, // Set as null since it's optional
    },
    date_pub: new Date(), 
        imageUrls: []
  };
  images: File[] = [];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

  constructor(private productService: ProductService, private router: Router,private fb: FormBuilder, private authService: AuthServiceService) { }
  ngOnInit(): void {
    this.hasCreatePermission = this.authService.hasPermission(['PRODUCT_MANAGER', 'SOCIETE']);
  console.log('Has Create Permission:', this.hasCreatePermission);

    // Initialize form
    this.productForm = this.fb.group({
      name: [''],
      price: [''],
      description: [''],
    });
  }
  onSubmit(): void {
    if (!this.hasCreatePermission) {
      Swal.fire({
        icon: 'error',
        title: 'Permission refusée',
        text: 'Vous n’avez pas la permission de créer un produit.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
      });
      return;
    }
    if (!this.product.name.trim() || !this.product.description.trim() || this.product.price <= 0 || this.product.quantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs obligatoires manquants',
        text: 'Veuillez remplir tous les champs requis avant de soumettre.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
      });
      return;
    }
  
    // If validation passes
    if (this.images.length > 0) {
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('description', this.product.description);
      formData.append('typeP', this.product.typeP);
      formData.append('price', this.product.price.toString());
      formData.append('quantity', this.product.quantity.toString());
      formData.append('attributes', JSON.stringify(this.product.attributes));
  
      this.images.forEach((image) => {
        formData.append('images', image, image.name);
      });
  
      this.productService.createProduct(formData).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Produit créé !',
          text: 'Votre produit a été ajouté avec succès.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#08639c'
        }).then(() => {
          this.router.navigate(['/products']);
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création du produit.',
          confirmButtonText: 'Réessayer',
          confirmButtonColor: '#08639c'
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Aucun fichier',
        text: 'Veuillez télécharger au moins une image.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
      });
    }
  }
  

  onFileChange(event: any): void {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > this.MAX_FILE_SIZE) {
        Swal.fire({
          icon: 'warning',
          title: 'Fichier trop volumineux',
          text: `Le fichier ${files[i].name} dépasse la limite de 5 Mo.`,
          confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
        });
        return;
      }

      const fileExists = this.images.some((image) => image.name === files[i].name);
      if (!fileExists) {
        this.images.push(files[i]);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Fichier déjà sélectionné',
          text: `Le fichier ${files[i].name} est déjà ajouté.`,
          confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
        });
      }
    }

    event.target.value = '';
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    Swal.fire({
      icon: 'info',
      title: 'Image supprimée',
      text: 'L\'image a été retirée avec succès.',
      confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
    });
  }

  addAttribute(): void {
    this.product.attributes.push({ key: '', value: '' });
  }

  removeAttribute(index: number): void {
    this.product.attributes.splice(index, 1);
    Swal.fire({
      icon: 'info',
      title: 'Attribut supprimé',
      text: 'L\'attribut a été retiré avec succès.',
      confirmButtonText: 'OK',
        confirmButtonColor: '#08639c'
    });
  }
}
