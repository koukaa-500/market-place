export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  role: string;
  active: boolean;
  image: String;  
   registrationDate: string | null;
  verificationCode: string;
  verificationCodeExpiry: string | null;
  categories: { id: number; name: string }[];
  employees: User[];
    societe: any; // Adjust to reflect the relationship with Societe if needed
}


export interface Category {
  id: number;
  name: string;
}