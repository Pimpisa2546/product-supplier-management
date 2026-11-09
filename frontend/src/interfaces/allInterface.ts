export interface Product {
	ID?: number;
	Name: string;
	SKU: string;
	Detail: string;
	ImageURL: string;
	Price: number;
	Width_Product: number;
	Height_Product: number;
	Length_Product: number;
	Weight_Product: number;
	Color_Product: string
	SupplierID: number;
	CategoryID: number;
	HazardID: number;
	VelocityID: number;
	Supplier?: Supplier;
	Category?: Category;
	Hazard?: Hazard;
	Velocity?: Velocity;

}

export interface Category {
	ID?: number;
	Name: string;
	UserID: number;
	User?: UserActivation;
}

export interface Supplier {
	ID?: number;
	Name: string;
	Phone: string;
	Email: string;
	ImageURL: string;
	Address: string;
	ContactName: string;
	ContactPhone: string;
	ContactEmail: string;
	Product?: Product[];
}

export interface Hazard {
	ID?: number;
	Name: string;
}

export interface Velocity {
	ID?: number;
	Name: string;
}

//-------Login---------
export interface LoginInterface {
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

export interface Transaction {
	Transaction_Type: string
	Quantity: number;
	MFG_Date: Date | string | null;
	EXP_Date: Date | string | null;
	Reason: string;
	Reference: string;
	Transaction_CreateDate: string;
	SKU: string;
	ProductID: number;
	Product?: Product;
}
// export interface CreateTransaction {
// 	Transaction_Type: string
// 	Quantity: number;
// 	MFG_Date: Date;
// 	EXP_Date: Date;
// 	Transaction_CreateDate: string;
// 	SKU:string;
// }