import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../AuthService/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { skipUntil } from 'rxjs';

@Component({
  selector: 'app-verify-component',
  templateUrl: './verify-component.component.html',
  styleUrls: ['./verify-component.component.css']
})
export class VerifyComponent implements OnInit {
  message = '';
  isOkay = true;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
  }
  private confirmAccount(token: string) {
    this.authService.confirm(token).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
        this.submitted = true;
        this.isOkay = true;
      },
      error: () => {
        this.message = 'Token has been expired or invalid';
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['']);
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  protected readonly skipUntil = skipUntil;
}