import React, { useState, useEffect } from "react";
import { message, Modal, Image, Spin, Row, Col, Typography, Divider } from "antd";
import { Product } from "../../interfaces/allInterface";
import { GetProductByID } from "../../services/AllService";

const { Text, Title } = Typography;

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

  const renderValue = (val: any, unit: string = "") => {
    if (val === null || val === undefined || val === "") return "-";
    return `${val} ${unit}`.trim();
  };

  const getRelationName = (relation: any, fallbackId: any) => {
    if (typeof relation === 'object' && relation?.Name) return relation.Name;
    return fallbackId || '-';
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Product Information</span>
          {productData?.Name && (
            <Text type="secondary" style={{ fontSize: '14px', fontWeight: 'normal' }}>
              — {productData.Name}
            </Text>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={760}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto", overflowX: "hidden", padding: '20px 24px' } }}
    >
      <Spin spinning={loading}>
        {productData && (
          <div>
            <Row gutter={24} align="middle">
              <Col span={8} style={{ textAlign: 'center' }}>
                <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '8px', display: 'inline-block' }}>
                  <Image
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                    src={productData.ImageURL}
                    fallback="https://via.placeholder.com/120?text=No+Image"
                  />
                </div>
              </Col>
              <Col span={16}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>PRODUCT NAME</Text>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#262626' }}>
                      {productData.Name || '-'}
                    </div>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>SKU</Text>
                      <div style={{ fontWeight: 500 }}>{productData.SKU || '-'}</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>PRICE</Text>
                      <div style={{ fontWeight: 600, color: '#52c41a', fontSize: '16px' }}>
                        ฿{productData.Price?.toLocaleString() ?? '-'}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <Row gutter={24}>
              <Col span={12}>
                <Title level={5} style={{ fontSize: '14px', marginBottom: '12px' }}>
                  Physical Properties
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#fafafa', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Width:</Text>
                    <Text strong>{renderValue(productData.Width_Product, 'cm')}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Length:</Text>
                    <Text strong>{renderValue(productData.Length_Product, 'cm')}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Height:</Text>
                    <Text strong>{renderValue(productData.Height_Product, 'cm')}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Weight:</Text>
                    <Text strong>{renderValue(productData.Weight_Product, 'kg')}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Color:</Text>
                    <Text strong>{productData.Color_Product || '-'}</Text>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <Title level={5} style={{ fontSize: '14px', marginBottom: '12px' }}>
                  Classification & Details
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#fafafa', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Category:</Text>
                    <Text strong>{getRelationName(productData.Category, productData.CategoryID)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Supplier:</Text>
                    <Text strong>{getRelationName(productData.Supplier, productData.SupplierID)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Hazard Level:</Text>
                    <Text strong>{getRelationName(productData.Hazard, productData.HazardID)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Velocity Rate:</Text>
                    <Text strong>{getRelationName(productData.Velocity, productData.VelocityID)}</Text>
                  </div>
                </div>
              </Col>
            </Row>

            {productData.Detail && (
              <>
                <Divider style={{ margin: '16px 0' }} />
                <div>
                  <Title level={5} style={{ fontSize: '14px', marginBottom: '8px' }}>
                    Detail / Description
                  </Title>
                  <div style={{ background: '#fafafa', padding: '12px', borderRadius: '6px', color: '#555', fontSize: '13px' }}>
                    {productData.Detail}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default ModalPreview;