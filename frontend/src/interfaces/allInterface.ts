export interface Product{
	ID?: number;   
	Name:   string;
	Detail: string;
	ImageURL: string;  
	Price:  number;
	Stock:  number;    
	SupplierID: number;	 
	CategoryID: number;	 
	HazardID: number; 
	VelocityID: number;
	Supplier?: Supplier; 
	Category?: Category;  
	Hazard?: Hazard;    
	Velocity?: Velocity; 

}

export interface Category{
    ID?:number;
    Name:string;
	UserID:number;
	User?:UserActivation;
}

export interface Supplier{
    ID?:number;
	Name:string;
	Phone:string;
	Email:string;
	ImageURL:string;
	Address:string;
	ContactName:string;
	ContactPhone:string;
	ContactEmail:string;
}

export interface Hazard{
    ID?:number;
    Name:string;
}

export interface Velocity{
    ID?:number;
    Name:string;
}

//-------Login---------
export interface LoginInterface{
	Email: string;
	Password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role_id: number;
  };
}