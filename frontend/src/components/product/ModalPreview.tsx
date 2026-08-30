import React, { useState, useEffect } from "react";
import { Descriptions, message, Modal, Image, Spin } from "antd";
import { Product } from "../../interfaces/allInterface";
import { GetProductByID } from "../../services/AllService";

interface ModalPreviewProps {
  open: boolean;
  productId: number | null;
  onClose: () => void;
}

export const ModalPreview: React.FC<ModalPreviewProps> = ({ open, productId, onClose }) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId || !open) return;
      setLoading(true);
      try {
        const data = await GetProductByID(productId);
        const result = Array.isArray(data) ? data[0] : data;
        setProductData(result);
      } catch (err) {
        console.error("Failed Fetch Data: ", err);
        message.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
    >
      <Spin spinning={loading}>
        {productData && (
          <Descriptions title="Product Information" column={1} bordered size="small">
            <Descriptions.Item label="Image">
              <Image 
                width={100} 
                src={productData.ImageURL} 
                fallback="https://via.placeholder.com/100?text=No+Image" 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Name">{productData.Name || '-'}</Descriptions.Item>
            <Descriptions.Item label="Price">฿{productData.Price?.toLocaleString() ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Stock">{productData.Stock ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Detail">{productData.Detail || '-'}</Descriptions.Item>
            <Descriptions.Item label="Supplier">
              {typeof productData.Supplier === 'object' ? productData.Supplier?.Name : (productData.SupplierID || '-')}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {typeof productData.Category === 'object' ? productData.Category?.Name : (productData.CategoryID || '-')}
            </Descriptions.Item>
            <Descriptions.Item label="Hazard Level">
              {typeof productData.Hazard === 'object' ? productData.Hazard?.Name : (productData.HazardID || '-')}
            </Descriptions.Item>
            <Descriptions.Item label="Velocity Rate">
              {typeof productData.Velocity === 'object' ? productData.Velocity?.Name : (productData.VelocityID || '-')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Spin>
    </Modal>
  );
};

export default ModalPreview;