import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { LoginComponent} from './login-component/login-component.component';
import { RegisterComponent } from './register-component/register-component.component';
import { AppComponent } from './app.component';
import { VerifyComponent } from './verify-component/verify-component.component';
import { OAuth2CallbackComponent } from './oauth2-callback/oauth2-callback.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { RegistreSocieteComponent } from './registre-societe/registre-societe.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GetemployeeComponent } from './getemployee/getemployee.component';
import { OvervieuwDashComponent } from './overvieuw-dash/overvieuw-dash.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrdersComponent } from './orders/orders.component';
import { MyCommandesComponent } from './my-commandes/my-commandes.component';
import { ProductsComponent } from './products/products.component';
import { CategoryComponent } from './category/category.component';
import { SocietesComponent } from './societes/societes.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AuthGuard } from './auth.guard';
const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/create', component: CreateProductComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'oauth2/callback', component: OAuth2CallbackComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['CLIENT'] } },
  { path: 'contact', component: ContactComponent },
  { path: 'product/:id', component: SingleProductComponent },
  { path: 'signupS', component: RegistreSocieteComponent },
  { path: 'create-Emp', component: CreateEmployeeComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'profile/commandes', component: MyCommandesComponent },
  { path: 'notfound', component: NotfoundComponent },

  // Dashboard route with child routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full'},
      { path: 'societe', component: SocietesComponent, canActivate: [AuthGuard],data: { roles: ['ADMIN'] } },
      { path: 'porduits', component: ProductsComponent, canActivate: [AuthGuard],data: { roles: ['SOCIETE', 'PRODUCT_MANAGER'] }  },
      { path: 'create-Emp', component: CreateEmployeeComponent, canActivate: [AuthGuard],data: { roles: ['SOCIETE'] } },
      { path: 'Employee', component: GetemployeeComponent , canActivate: [AuthGuard],data: { roles: ['SOCIETE'] }},
      { path: 'profile', component: ProfileComponent },
      { path: 'commandes', component: OrdersComponent, canActivate: [AuthGuard],data: { roles: ['SOCIETE', 'ORDER_MANAGER'] } },
      { path: 'OvervieuwD', component: OvervieuwDashComponent },
      { path: 'categories', component: CategoryComponent, canActivate: [AuthGuard],data: { roles: ['ADMIN'] } },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
