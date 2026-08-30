import { Product, Category, Supplier, Hazard, Velocity,LoginInterface,LoginResponse } from '../interfaces/allInterface';
import api from "./api";

//--------Product---------
const AddNewProduct = async (data:Product) => {
    const res = await api.post(`/products`,data);
    return res.data;
};

 const GetAllProduct = async () => {
    const res = await api.get(`/products`);
    return res.data;
};

const DeleteProduct = async (id: number | string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
};

const UpdateProduct = async (id: number | string, productData: any) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
};

const GetProductByID = async (id: number | string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
};

//--------Supplier--------
const AddNewSupplier = async (data:Supplier) => {
    const res = await api.post(`/suppliers`,data);
    return res.data;
};

 const GetSupplier = async () => {
    const res = await api.get(`/suppliers`);
    return res.data;
};

const UpdateSupplier = async (id: number | string, supData: any) => {
    const res = await api.put(`/suppliers/${id}`, supData);
    return res.data;
};

const DeleteSupplier = async (id: number | string) => {
    const res = await api.delete(`/suppliers/${id}`);
    return res.data;
};

const GetSupplierByID = async (id: number | string) => {
    const res = await api.get(`/suppliers/${id}`);
    return res.data;
};

//--------Category--------
const AddCategory = async (data:Category) => {
    const res = await api.post(`/categories`,data);
    return res.data;
};

 const GetCategory = async () => {
    const res = await api.get(`/categories`);
    return res.data;
};

const UpdateCategory = async (id: number | string, catData: any) => {
    const res = await api.put(`/categories/${id}`, catData);
    return res.data;
};

const DeleteCategory = async (id: number | string) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
};

//--------Hazard----------
const AddHazard = async (data:Hazard) => {
    const res = await api.post(`/hazards`,data);
    return res.data;
};

 const GetHazard = async () => {
    const res = await api.get(`/hazards`);
    return res.data;
};

//---------Velocity--------
const AddVelocity = async (data:Velocity) => {
    const res = await api.post(`/velocities`,data);
    return res.data;
};

 const GetVelocity = async () => {
    const res = await api.get(`/velocities`);
    return res.data;
};

//----------login----------
const Login = async(data:LoginInterface): Promise<LoginResponse>=>{
    const res = await api.post<LoginResponse>(`/login`,data);
    return res.data;
};

export {
//Product
    AddNewProduct,
    GetAllProduct,
    DeleteProduct,
    UpdateProduct,
    GetProductByID,
//Supplier
    AddNewSupplier,
    GetSupplier,
    UpdateSupplier,
    DeleteSupplier,
    GetSupplierByID,
//Category
    AddCategory,
    GetCategory,
    UpdateCategory,
    DeleteCategory,
//Hazard
    AddHazard,
    GetHazard,
//Velocity
    AddVelocity,
    GetVelocity,
//Login
    Login,
};