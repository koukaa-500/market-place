import { User } from "../UserService/User";

export interface Product {
  id: number;
  name: string;
  description: string;
  typeP: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  category: any; 
  attributes: { key: string; value: string }[];
  date_pub: Date;
  user:User
  images?: File[]; // For handling file uploads
}
