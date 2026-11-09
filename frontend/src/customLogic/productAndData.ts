import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { Product, Category, Supplier, Hazard, Velocity, Transaction } from '../interfaces/allInterface';
import { GetAllProduct, DeleteProduct, GetSupplier, GetCategory, GetHazard, GetVelocity, GetTransaction } from '../services/AllService';

export const useProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [hazard, setHazard] = useState<Hazard[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [velocity, setVelocity] = useState<Velocity[]>([]);
  const [transections, setTransections] = useState<Transaction[]>([]);
  
  const [searchName, setSearchName] = useState<string>('');
  const [appliedSearchName, setAppliedSearchName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedHazard, setSelectedHazard] = useState<string>('');
  const [selectedVelocity, setSelectedVelocity] = useState<string>('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

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

    const fetchTransection = async () => {
    try {
      const res = await GetTransaction();
      const transactionData = res.data ? res.data : res;
      setTransections(transactionData);
    } catch (err) {
      console.error("Failed Fetch Transection: ", err);
      message.error("Failed Fetch Transection");
    }
  };

  const fetchData = async (page = 1, pageSize = 5, search = '', categoryId = '', hazardId = '', velocityId = '') => {
    setLoading(true);
    try {
      const response = await GetAllProduct({
        page: page,
        limit: pageSize,
        search: search,
        category_id: categoryId,
        hazard_id: hazardId,
        velocity_id: velocityId,
      });
      const productList = response.data ? response.data : response;
      setProducts(productList);

      if (response.total_items !== undefined) {
        setPagination({
          current: response.current_page || page,
          pageSize: response.limit || pageSize,
          total: response.total_items || 0,
        });
      }
      await fetchMasterData();
      await fetchTransection();
    } catch (err) {
      console.error("Failed Fetch Data: ", err);
      message.error("Failed Fetch Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pagination.pageSize, appliedSearchName, selectedCategory, selectedHazard, selectedVelocity);
  }, [selectedCategory, selectedHazard, selectedVelocity]);

  // Handlers
  const handleDelete = async (id: number) => {
    try {
      await DeleteProduct(id);
      message.success("Delete Product Success");
      fetchData(pagination.current, pagination.pageSize, appliedSearchName, selectedCategory, selectedHazard, selectedVelocity);
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
    setAppliedSearchName(searchName);
    fetchData(1, pagination.pageSize, searchName, selectedCategory, selectedHazard, selectedVelocity);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setAppliedSearchName('');
    setSelectedCategory('');
    setSelectedHazard('');
    setSelectedVelocity('');
    fetchData(1, 5, '', '', '', '');
  };

  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize, appliedSearchName, selectedCategory, selectedHazard, selectedVelocity);
  };

  const stockProduct = useMemo(()=>{
    const stockMap = (transections || []).reduce((acc,tran)=>{
      const stock = tran.Transaction_Type === 'IN' ? tran.Quantity : -tran.Quantity;
      const productId = tran.ProductID;
      if (productId){
        acc[productId] = (acc[productId] || 0) + stock;
      }
      
      return acc;
    }, {} as Record<number, number>);
    return (products || []).map((product) => ({
      ...product,
      Stock: stockMap[product.ID!] ?? 0,
    }));
  }, [products,transections]);

  return {
    fetchData: () => fetchData(pagination.current, pagination.pageSize, appliedSearchName, selectedCategory, selectedHazard, selectedVelocity),
    fetchMasterData,
    handleDelete,
    handleEdit,
    openCreateModal,
    handleCloseModal,
    handleOpenMasterData: () => setModalMaster(true),
    handleCloseMasterData: () => setModalMaster(false),
    handleSearch,
    handleResetSearch,
    handleTableChange,
    stockProduct,
    pagination,

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