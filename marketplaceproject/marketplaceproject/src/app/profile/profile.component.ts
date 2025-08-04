import { Component, OnInit } from '@angular/core';
import { UserService } from '../UserService/user.service';
import { User } from '../UserService/User';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  userRole: string = '';
  isProfilePage: boolean = false;
  selectedFile: File | null = null; // To handle file uploads

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.checkIfProfilePage();
    this.router.events.subscribe(() => {
      this.checkIfProfilePage();
    });
    this.userService.getUserProfile().subscribe({
      next: (data: User) => {
        console.log('User profile data:', data);
        this.user = data;
      },
      error: (err) => {
        console.error('Error fetching user profile', err);
      },
    });
  }

  checkIfProfilePage(): void {
    this.isProfilePage = this.router.url === '/profile';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Save the selected file
    }
  }

  updateUserDetails(): void {
    if (this.user) {
      this.userService.updateUser(this.user.id, this.user).subscribe({
        next: (response) => {
          if (this.selectedFile) {
            this.updateUserImage();
          } else {
            this.handleUpdateSuccess();
          }
        },
        error: (error) => {
          console.error('Error updating user details:', error);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Could not update user details. Please try again.',
          });
        },
      });
    }
  }

  private updateUserImage(): void {
    if (this.user && this.selectedFile) {
      this.userService.updateUserImage(this.user.id, this.selectedFile).subscribe({
        next: (updatedUser) => {
          this.user!.image = updatedUser.image; // Update image locally
          this.handleUpdateSuccess();
        },
        error: (error) => {
          console.error('Error updating user image:', error);
          Swal.fire({
            icon: 'error',
            title: 'Image Update Failed',
            text: 'Could not update user image. Please try again.',
          });
        },
      });
    }
  }

  private handleUpdateSuccess(): void {
    Swal.fire({
      icon: 'success',
      title: 'User Updated',
      text: 'User details updated successfully!',
      confirmButtonText: 'OK'
    }).then(() => {
      this.refreshProfile(); // Refresh profile data
    });
  }

  private refreshProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data: User) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error refreshing profile data', err);
      },
    });
  }
}
