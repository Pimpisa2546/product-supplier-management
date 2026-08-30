import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Product, Category, Supplier, Hazard, Velocity } from '../interfaces/allInterface';
import { GetAllProduct, DeleteProduct, GetSupplier, GetCategory, GetHazard, GetVelocity } from '../services/AllService';

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

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMaster, setModalMaster] = useState<boolean>(false);

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

  // Handlers
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSearch = () => {
    let filtered = [...allProducts];

    if (searchName.trim()) {
      filtered = filtered.filter((item) =>
        item.Name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.CategoryID === Number(selectedCategory));
    }
    if (selectedHazard) {
      filtered = filtered.filter((item) => item.HazardID === Number(selectedHazard));
    }
    if (selectedVelocity) {
      filtered = filtered.filter((item) => item.VelocityID === Number(selectedVelocity));
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

  return {
    fetchData,
    fetchMasterData,
    handleDelete,
    handleEdit,
    openCreateModal,
    handleCloseModal,
    handleOpenMasterData: () => setModalMaster(true),
    handleCloseMasterData: () => setModalMaster(false),
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

    editingProduct,
    modalOpen,
    loading,
    modalMaster,
    products,
    supplier,
    hazard,
    category,
    velocity,
  };
};

export default useProductManager;