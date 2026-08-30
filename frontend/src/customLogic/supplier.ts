import { useEffect, useState } from "react";
import { DeleteSupplier, GetSupplier } from "../services/AllService";
import { Supplier } from "../interfaces/allInterface";
import { message } from "antd";

export const supplierLogic = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [rawSuppliers, setRawSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editSup, setEditSup] = useState<Supplier | null>(null);

  const [searchName, setSearchName] = useState<string>('');
  const [modalPreOpen, setModalPreOpen] = useState<boolean>(false);
  const [selectedSupId, setSelectedSupId] = useState<number | null>(null);

  const handleSaveSuccess = (savedSupplier: Supplier, isEdit: boolean) => {
    let nextList: Supplier[];
    if (isEdit) {
      nextList = rawSuppliers.map((item) => (item.ID === savedSupplier.ID ? savedSupplier : item));
    } else {
      nextList = [...rawSuppliers, savedSupplier];
    }
    setRawSuppliers(nextList);
    setSupplier(nextList);
  };

  const handleEdit = (values: Supplier) => {
    setEditSup(values);
    setModalOpen(true);
  };

  const handleModalOpen = () => {
    setEditSup(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditSup(null);
  };

  const handlePreviewSupID = (values: Supplier) => {
    if (!values?.ID) {
      message.warning("Invalid Supplier ID");
      return;
    }
    setSelectedSupId(values.ID);
    setModalPreOpen(true);
  };

  const handlePreviewClose = () => {
    setModalPreOpen(false);
    setSelectedSupId(null);
  };

  const handleDeleteSupplier = async (id?: number) => {
    if (id === undefined) {
      message.warning("Invalid Supplier ID");
      return;
    }
    try {
      await DeleteSupplier(id);
      const nextList = rawSuppliers.filter((item) => item.ID !== id);
      setRawSuppliers(nextList);
      setSupplier(nextList);
      message.success("Delete Supplier Success");
    } catch (err) {
      console.error("Failed Delete Supplier: ", err);
      message.error("Failed Delete Supplier");
    }
  };

  const handleSearch = () => {
    if (!searchName.trim()) {
      setSupplier(rawSuppliers);
      return;
    }
    const filtered = rawSuppliers.filter((item) =>
      item.Name.toLowerCase().includes(searchName.trim().toLowerCase())
    );
    setSupplier(filtered);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setSupplier(rawSuppliers);
  };

  const fetchSupplier = async () => {
    setLoading(true);
    try {
      const dataSupplier = await GetSupplier();
      setSupplier(dataSupplier);
      setRawSuppliers(dataSupplier);
    } catch (err) {
      console.error("Failed Fetch Data: ", err);
      message.error("Failed Fetch Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, []);

  return {
    handleEdit,
    handleModalOpen,
    handleModalClose,
    handleSaveSuccess,
    handlePreviewSupID,
    handlePreviewClose,
    handleDeleteSupplier,
    handleSearch,
    handleResetSearch,

    searchName,
    setSearchName,

    modalOpen,
    supplier,
    loading,
    editSup,
    modalPreOpen,
    selectedSupId,
  };
};

export default supplierLogic;