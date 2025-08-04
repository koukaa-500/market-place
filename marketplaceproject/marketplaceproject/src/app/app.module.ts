import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './product-list/product-list.component';
import { LoginComponent} from './login-component/login-component.component';
import { RegisterComponent } from './register-component/register-component.component';
import { VerifyComponent } from './verify-component/verify-component.component';
import { OAuth2CallbackComponent } from './oauth2-callback/oauth2-callback.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { FooterComponent } from './home/footer/footer.component';
import { HeaderComponent } from './home/header/header.component';
import { CodeInputModule } from 'angular-code-input';
import { RegistreSocieteComponent } from './registre-societe/registre-societe.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { GetemployeeComponent } from './getemployee/getemployee.component';
import { OvervieuwDashComponent } from './overvieuw-dash/overvieuw-dash.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrdersComponent } from './orders/orders.component';
import { MyCommandesComponent } from './my-commandes/my-commandes.component';
import { ProductsComponent } from './products/products.component';
import { CategoryComponent } from './category/category.component';
import { SocietesComponent } from './societes/societes.component';
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateProductComponent,
    ProductListComponent,
    RegisterComponent,
    LoginComponent,
    VerifyComponent,
    OAuth2CallbackComponent,
    ProfileComponent,
    ContactComponent,
    SingleProductComponent,
    UpdateProductComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    RegistreSocieteComponent,
    CreateEmployeeComponent,
    DashboardComponent,
    SidebarComponent,
    GetemployeeComponent,
    OvervieuwDashComponent,
    ShoppingCartComponent,
    OrdersComponent,
    MyCommandesComponent,
    ProductsComponent,
    CategoryComponent,
    SocietesComponent,
    NotfoundComponent,
  

    
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CodeInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
