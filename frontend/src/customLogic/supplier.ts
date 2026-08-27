import { useEffect, useState } from "react";
import { AddNewSupplier, DeleteSupplier, GetSupplier, GetSupplierByID, UpdateSupplier } from "../services/AllService";
import { Supplier } from "../interfaces/allInterface";
import { getBase64 } from "../customLogic/uploadImage";
import { Form, message, UploadFile, UploadProps } from "antd";

export const supplierLogic = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [rawSuppliers, setRawSuppliers] = useState<Supplier[]>([]); // 👈 เก็บข้อมูลตั้งต้นทั้งหมด
    const [loading, setLoading] = useState<boolean>(false);
    const [editSup, setEditSup] = useState<Supplier | null>(null);

    const [searchName, setSearchName] = useState<string>('');

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPage = 2;

    const [modalPreOpen, setModalPreOpen] = useState<boolean>(false);
    const [supplierById, setSupplierById] = useState<Supplier[]>([]);
    
    const [activeTab, setActiveTab] = useState<string>('supplier');

    const handleNext = async () => {
        try {
            if (currentPage === 1) {
                await form.validateFields(['supplierName', 'supplierEmail', 'supplierPhone', 'supplierAddress']);
            }
            if (currentPage < totalPage) setCurrentPage((prev) => prev + 1);
        } catch (error) {
            console.log("Validation Failed:", error);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const onChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        setFileList(newFileList);

        if (!newFileList || newFileList.length === 0) {
            form.setFieldsValue({ imageURL: '' });
            return;
        }
        const latestFile = newFileList[newFileList.length - 1];
        if (latestFile.url) {
            form.setFieldsValue({ imageURL: latestFile.url });
            return;
        }
        if (latestFile.status === 'done' && latestFile.response?.url) {
            form.setFieldsValue({ imageURL: latestFile.response.url });
            return;
        }
        if (latestFile.originFileObj) {
            const base64 = await getBase64(latestFile.originFileObj as any);
            form.setFieldsValue({ imageURL: base64 });
            return;
        }
    };

    const handleSaveSupplier = async (values: any) => {
        const payload = {
            Name: values.supplierName,
            Phone: values.supplierPhone,
            Email: values.supplierEmail,
            ImageURL: values.imageURL,
            Address: values.supplierAddress,
            ContactName: values.contactName,
            ContactPhone: values.contactPhone,
            ContactEmail: values.contactEmail,
        };

        if (editSup) {
            try {
                const updateSupplier = await UpdateSupplier(editSup.ID!, payload);
                const updatedList = (prev: Supplier[]) => 
                    prev.map((item) => item.ID === editSup.ID ? { ...item, ...payload, ...updateSupplier } : item);
                
                setSupplier(updatedList);
                setRawSuppliers(updatedList); // 👈 อัปเดตข้อมูลตั้งต้นด้วย
                message.success("Update Supplier Success");
            } catch (err) {
                console.error("Failed Supplier Product: ", err);
                message.error("Failed Supplier Product");
            }
        } else {
            try {
                const addNewSupplier = await AddNewSupplier(payload);
                const addedList = (prev: Supplier[]) => [...prev, addNewSupplier];

                setSupplier(addedList);
                setRawSuppliers(addedList); // 👈 อัปเดตข้อมูลตั้งต้นด้วย
                message.success("Add Supplier Success");
            } catch (err) {
                console.error("Failed Add Supplier: ", err);
                message.error("Failed Add Supplier");
            }
        }

        handleModalClose();
    };

    const handleEdit = async (values: Supplier) => {
        setEditSup(values);
        if (values.ImageURL) {
            setFileList([
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: values.ImageURL,
                },
            ]);
        } else {
            setFileList([]);
        }

        form.setFieldsValue({
            supplierName: values.Name,
            supplierPhone: values.Phone,
            supplierEmail: values.Email,
            imageURL: values.ImageURL,
            supplierAddress: values.Address,
            contactName: values.ContactName,
            contactPhone: values.ContactPhone,
            contactEmail: values.ContactEmail,
        });
        setCurrentPage(1);
        setModalOpen(true);
    };

    const handleModalOpen = () => {
        setEditSup(null);
        setFileList([]);
        form.resetFields();
        setCurrentPage(1);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditSup(null);
        setFileList([]);
        form.resetFields();
        setCurrentPage(1);
    };

    const handlePreviewSupID = async (values: Supplier) => {
        if (!values?.ID) {
            message.warning("Invalid Supplier ID");
            return;
        }
        setLoading(true);
        setActiveTab('supplier'); 
        setModalPreOpen(true);
        try {
            const dataSupplID = await GetSupplierByID(values.ID);
            setSupplierById(Array.isArray(dataSupplID) ? dataSupplID : [dataSupplID]);
        } catch (err) {
            console.error("Failed Fetch Data: ", err);
            message.error("Failed Fetch Data");
        } finally {
            setLoading(false);
        }
    };

    const handlePreviewClose = () => {
        setModalPreOpen(false);
        setSupplierById([]);
    };

    const handleDeleteSupplier = async (id?: number) => {
        if (id === undefined) {
            message.warning("Invalid Supplier ID");
            return;
        }
        try {
            await DeleteSupplier(id);
            const filteredList = (prev: Supplier[]) => prev.filter((item) => item.ID !== id);

            setSupplier(filteredList);
            setRawSuppliers(filteredList); // 👈 อัปเดตข้อมูลตั้งต้นด้วย
            console.log("Delete Supplier Success");
            message.success("Delete Supplier Success");
        } catch (err) {
            console.error("Failed Delete Supplier: ", err);
            message.error("Failed Delete Supplier");
        }
    };

    const handleSearch = () => {
        let filtered = [...rawSuppliers]; // 👈 ดึงจาก rawSuppliers เพื่อกรองข้อมูลจากทั้งหมดเสมอ

        if (searchName.trim()) {
            filtered = filtered.filter((item) =>
                item.Name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        setSupplier(filtered);
    };

    const handleResetSearch = () => {
        setSearchName('');
        setSupplier(rawSuppliers); // 👈 คืนค่าทั้งหมดกลับมาเมื่อกด Reset
    };

    const fetchSupplier = async () => {
        setLoading(true);
        try {
            const dataSupplier = await GetSupplier();
            setSupplier(dataSupplier);
            setRawSuppliers(dataSupplier); // 👈 เก็บ Master Data เริ่มต้นไว้
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
        handleNext,
        handlePrev,
        onChange,
        handleSaveSupplier,
        handleEdit,
        handleModalOpen,
        handleModalClose,
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
        form,
        fileList,
        modalPreOpen,
        supplierById,
        activeTab,
        currentPage,
        totalPage,
        setActiveTab,
    };
};

export default supplierLogic;