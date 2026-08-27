import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { Product, Category, Supplier, Hazard, Velocity } from '../interfaces/allInterface';
import { AddNewProduct, GetAllProduct, DeleteProduct, UpdateProduct, DeleteCategory, UpdateCategory } from '../services/AllService';
import { GetSupplier, AddCategory, GetCategory, GetHazard, GetVelocity } from '../services/AllService';
import type { UploadFile, UploadProps } from 'antd';
import { getBase64, handleImagePreview } from './uploadImage';

export const useProductManager = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [hazard, setHazard] = useState<Hazard[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [velocity, setVelocity] = useState<Velocity[]>([]);
  
  const [searchName, setSearchName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedHazard, setSelectedHazard] = useState<string>('');
  const [selectedVelocity, setSelectedVelocity] = useState<string>('');

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMaster, setModalMaster] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [modalAddCat, setModalCat] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [masterForm] = Form.useForm();
  const selectType = Form.useWatch("masterType", masterForm);

  const onChange: UploadProps['onChange'] = async ({ file, fileList: newFileList }) => {
    if (file.status === 'removed' || !newFileList || newFileList.length === 0) {
      setFileList([]);
      form.setFieldValue('imageURL', '');
      return;
    }
    setFileList(newFileList);

    const latestFile = newFileList[newFileList.length - 1];

    if (latestFile.url) {
      form.setFieldValue('imageURL', latestFile.url);
      return;
    }

    if (latestFile.status === 'done' && latestFile.response?.url) {
      form.setFieldValue('imageURL', latestFile.response.url);
      return;
    }

    if (latestFile.originFileObj) {
      const base64 = await getBase64(latestFile.originFileObj as any);
      form.setFieldValue('imageURL', base64);
      return;
    }
  };

  const handleSaveProduct = async (values: any) => {
    const payload = {
      Name: values.productName,
      Detail: values.detail,
      ImageURL: values.imageURL || '',
      Price: values.price,
      Stock: values.stock,
      SupplierID: values.SupplierID,
      CategoryID: values.CategoryID,
      HazardID: values.HazardID,
      VelocityID: values.VelocityID,
    };

    if (editProduct) {
      try {
        const updateProduct = await UpdateProduct(editProduct.ID!, payload);
        const updatedList = allProducts.map((item) =>
          item.ID === editProduct.ID
            ? {
                ...item,
                ...payload,
                ...updateProduct,
                Category: category.find((c) => c.ID === values.CategoryID) || item.Category,
                Supplier: supplier.find((s) => s.ID === values.SupplierID) || item.Supplier,
              }
            : item
        );
        setAllProducts(updatedList);
        setProducts(updatedList);

        message.success("Update Product Success");
      } catch (err) {
        console.error("Failed Update Product: ", err);
        message.error("Failed Update Product");
      }
    } else {
      try {
        const addNewProduct = await AddNewProduct(payload);
        const newList = [...allProducts, addNewProduct];
        setAllProducts(newList);
        setProducts(newList);

        message.success("Add Product Success");
      } catch (err) {
        console.error("Failed Add Product: ", err);
        message.error("Failed Add Product");
      }
    }

    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    try {
      await DeleteProduct(id);
      const updatedList = allProducts.filter((item) => item.ID !== id);
      setAllProducts(updatedList);
      setProducts(updatedList);

      message.success("Delete Product Success");
    } catch (err) {
      console.error("Failed Delete Product: ", err);
      message.error("Failed Delete Product");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await DeleteCategory(id);
      setCategory((prev) => prev.filter((item) => item.ID !== id));
      message.success("Delete Category Success");
    } catch (err) {
      console.error("Failed Delete Category: ", err);
      message.error("Failed Delete Category");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setFileList([]);
    form.resetFields();
  };

  const handleCloseCategoryModal = () => {
    setModalCat(false);
    masterForm.resetFields();
  };

  const openCategoryModal = () => {
    setModalCat(true);
  };

  const handleOpenMasterData = () => {
    setModalMaster(true);
  };

  const handleCloseMasterData = () => {
    setModalMaster(false);
  };

  const handleEdit = async (product: Product) => {
    setEditProduct(product);
    if (product.ImageURL) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: product.ImageURL,
        },
      ]);
    } else {
      setFileList([]);
    }

    form.setFieldsValue({
      productName: product.Name,
      detail: product.Detail,
      imageURL: product.ImageURL || '',
      price: product.Price,
      stock: product.Stock,
      SupplierID: product.SupplierID,
      CategoryID: product.CategoryID,
      HazardID: product.HazardID,
      VelocityID: product.VelocityID,
    });
    setModalOpen(true);
  };

  const fetchMasterData = async () => {
    try {
      const [dataSupplier, dataCategory, dataHazard, dataVelocity] = await Promise.all([
        GetSupplier(), GetCategory(), GetHazard(), GetVelocity()
      ]);
      setSupplier(dataSupplier);
      setCategory(dataCategory);
      setHazard(dataHazard);
      setVelocity(dataVelocity);
    } catch (err) {
      console.error("Failed Fetch Master Data: ", err);
      message.error("Failed Fetch Master Data");
    }
  };

  const handleSaveCategory = async (data: { ID?: number; Name: string }) => {
    if (!data || !data.Name.trim()) {
      message.warning("Please enter category name");
      return;
    }
    const userId = localStorage.getItem('user');
    if (!userId) {
      alert('User session not found. Please log in again.');
      return;
    }
    const payload = {
      Name: data.Name.trim(),
      UserID: Number(userId)
    };

    if (data.ID) {
      try {
        const updateCat = await UpdateCategory(data.ID, payload);
        setCategory((prev) =>
          prev.map((item) =>
            item.ID === data.ID
              ? { ...item, ...payload, ...updateCat }
              : item
          )
        );
        message.success("Update Category Success");
      } catch (err) {
        console.error("Failed Update Category: ", err);
        message.error("Failed Update Category");
      }
    } else {
      try {
        const addNewCat = await AddCategory(payload);
        setCategory((prev) => [...prev, addNewCat]);
        message.success("Add Category Success");
      } catch (err) {
        console.error("Failed Add Category: ", err);
        message.error("Failed Add Category");
      }
    }
  };

  const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const openCreateModal = () => {
    setEditProduct(null);
    setFileList([]);
    form.resetFields();
    setModalOpen(true);
  };

  const handleSearch = () => {
    let filtered = [...allProducts];

    if (searchName.trim()) {
      filtered = filtered.filter((item) =>
        item.Name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.CategoryID === Number(selectedCategory)
      );
    }

    if (selectedHazard) {
      filtered = filtered.filter(
        (item) => item.HazardID === Number(selectedHazard)
      );
    }

    if (selectedVelocity) {
      filtered = filtered.filter(
        (item) => item.VelocityID === Number(selectedVelocity)
      );
    }

    setProducts(filtered);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setSelectedCategory('');
    setSelectedHazard('');
    setSelectedVelocity('');
    setProducts(allProducts);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const dataProduct = await GetAllProduct();
      await fetchMasterData();
      setAllProducts(dataProduct);
      setProducts(dataProduct);
    } catch (err) {
      console.error("Failed Fetch Data: ", err);
      message.error("Failed Fetch Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    onChange,
    onPreview: handleImagePreview,
    handleSaveProduct,
    handleDelete,
    handleCloseModal,
    handleCloseCategoryModal,
    handleEdit,
    openCreateModal,
    openCategoryModal,
    capitalize,
    handleOpenMasterData,
    handleCloseMasterData,
    handleDeleteCategory,
    handleSaveCategory,
    handleSearch,
    handleResetSearch,

    searchName,
    setSearchName,
    selectedCategory,
    setSelectedCategory,
    selectedHazard,
    setSelectedHazard,
    selectedVelocity,
    setSelectedVelocity,

    editProduct,
    modalOpen,
    loading,
    modalMaster,
    modalAddCat,
    products,
    supplier,
    hazard,
    category,
    velocity,
    fileList,

    form,
    masterForm,
    selectType,
  };
};

export default useProductManager;