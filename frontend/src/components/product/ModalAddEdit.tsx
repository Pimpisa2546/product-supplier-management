import { Button, Form, Input, InputNumber, message, Modal, Select, Upload, UploadFile, UploadProps } from "antd";
import React, { useEffect, useState } from "react";
import { Category, Hazard, Product, Supplier, Velocity } from "../../interfaces/allInterface";
import { AddNewProduct, UpdateProduct } from "../../services/AllService";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import {PlusOutlined} from '@ant-design/icons';
import { getBase64 } from "../../customLogic/uploadImage";

interface ModalAddEditProps {
  open: boolean;
  editingProduct?: Product | null;
  supplierList: Supplier[];
  categoryList: Category[];
  hazardList: Hazard[];
  velocityList: Velocity[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalAddEditProduct: React.FC<ModalAddEditProps> = ({
    open,editingProduct,supplierList,categoryList,hazardList,velocityList,onClose,onSuccess,
}) => {
    
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const isEditMode = Boolean(editingProduct);

    useEffect(()=>{
        if(open){
            if(editingProduct){
                form.setFieldsValue({
                  productName: editingProduct.Name,
                  detail: editingProduct.Detail,
                  imageURL: editingProduct.ImageURL,
                  price: editingProduct.Price,
                  stock: editingProduct.Stock,
                  SupplierID: editingProduct.SupplierID,
                  CategoryID: editingProduct.CategoryID,
                  HazardID: editingProduct.HazardID,
                  VelocityID: editingProduct.VelocityID,
                });
                if (editingProduct.ImageURL) {
                  setFileList([
                    {
                      uid: '-1',
                      name: 'image.png',
                      status: 'done',
                      url: editingProduct.ImageURL,
                    },
                  ]);
                } else {
                  setFileList([]);
                }
            }else{
                form.resetFields();
                setFileList([]);
            }
        }
    },[open,editingProduct,form])


    const handleCloseModal = () => {
        setFileList([]);
        form.resetFields();
        onClose();
    };

    const handleUploadChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
      setFileList(newFileList);
        
      const file = newFileList[0];
      if (file && file.originFileObj) {
        const base64 = await getBase64(file.originFileObj);
        form.setFieldValue('imageURL', base64);
      } else if (newFileList.length === 0) {
        form.setFieldValue('imageURL', '');
      }
    };

    const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
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
    try {
      if (isEditMode && editingProduct?.ID) {
        await UpdateProduct(editingProduct.ID, payload);
        message.success("Update Product Success");
      } else {
        await AddNewProduct(payload);
        message.success("Add Product Success");
      }
      onSuccess();
      handleCloseModal();
    } catch (err) {
      console.error("Failed Save Product: ", err);
      message.error(isEditMode ? "Failed Update Product" : "Failed Add Product");
    }
  };
  return(
    <Modal
        title={isEditMode ? 'Edit Product' : 'Add Product'}
        open={open}
        onCancel={handleCloseModal}
        centered
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={() => { form.submit(); }}>
            {isEditMode ? 'Update Product' : 'Add Product'}
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProduct}>
          <Form.Item name="imageURL" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="productName" label="Product Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Product Image">
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                onPreview={handlePreview}
                beforeUpload={() => false}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item name="detail" label="Detail">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input the stock!' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="SupplierID" label="Supplier" rules={[{ required: true, message: 'Please select a supplier!' }]}>
            <Select placeholder="Select Supplier">
              {supplierList.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="CategoryID" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
            <Select placeholder="Select Category">
              {categoryList.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="HazardID" label="Hazard Level" rules={[{ required: true, message: 'Please select a hazard level!' }]}>
            <Select placeholder="Select Hazard Level">
              {hazardList.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="VelocityID" label="Velocity Rate" rules={[{ required: true, message: 'Please select a velocity rate!' }]}>
            <Select placeholder="Select Velocity Rate">
              {velocityList.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default ModalAddEditProduct;