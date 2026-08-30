import { Modal, Layout, Menu, Descriptions, Space, Input, List, Tag, message, Grid, MenuProps, Image } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { Supplier } from "../../interfaces/allInterface";
import { GetSupplierByID } from "../../services/AllService";
import { InboxOutlined, SearchOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";

interface ModalPreviewSupProps {
  open: boolean;
  supplierId: number | null;
  onClose: () => void;
}

const { useBreakpoint } = Grid;
type MenuItem = Required<MenuProps>['items'][number];

export const ModalPreviewSup: React.FC<ModalPreviewSupProps> = ({ open, supplierId, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('supplier');
  const [productSearch, setProductSearch] = useState<string>("");
  const [supplierData, setSupplierData] = useState<Supplier | null>(null);

  const screens = useBreakpoint();

  useEffect(() => {
    const fetchData = async () => {
        if (!supplierId || !open) return;
        setActiveTab('supplier');
        setLoading(true);
      try {
        const data = await GetSupplierByID(supplierId);
        const result = Array.isArray(data) ? data[0] : data;
        setSupplierData(result);
      } catch (err) {
        console.error("Failed Fetch Data: ", err);
        message.error("Failed to load supplier details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supplierId, open]);

  const getResponsiveWidth = () => {
    if (screens.xxl) return '40%';
    if (screens.xl) return '50%';
    if (screens.lg) return '60%';
    if (screens.md) return '70%';
    if (screens.sm) return '80%';
    return '90%';
  };

  const items: MenuItem[] = [
    { key: 'supplier', label: 'Supplier', icon: <ShopOutlined /> },
    { key: 'contact', label: 'Contact', icon: <UserOutlined /> },
    { key: 'product', label: 'Product', icon: <InboxOutlined /> },
  ];

  const filteredProducts = (supplierData?.Product || []).filter((prod: any) =>
    (prod.Name || prod.name || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <Modal
      title="Supplier Preview"
      open={open}
      onCancel={() => {
        setProductSearch("");
        onClose();
      }}
      width={getResponsiveWidth()}
      centered
      footer={null}
      loading={loading}
    >
      <Layout style={{ background: '#ffffff', marginTop: 16 }}>
        <Sider width={130} style={{ background: "#ffffff", borderRight: '1px solid #f0f0f0' }}>
          <Menu
            theme="light"
            style={{ width: '100%', borderRight: 0 }}
            selectedKeys={[activeTab]}
            mode="inline"
            items={items}
            onClick={(e) => setActiveTab(e.key)}
          />
        </Sider>
        <Content style={{ padding: '0 16px', minHeight: 250, background: '#ffffff' }}>
          {supplierData && (
            <>
              {activeTab === "supplier" && (
                <Descriptions title="Supplier Information" column={1} bordered size="small">
                  <Descriptions.Item label="Image">
                    <Image width={100} src={supplierData.ImageURL} fallback="https://via.placeholder.com/100" />
                  </Descriptions.Item>
                  <Descriptions.Item label="Name">{supplierData.Name || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Email">{supplierData.Email || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{supplierData.Phone || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Address">{supplierData.Address || '-'}</Descriptions.Item>
                </Descriptions>
              )}

              {activeTab === "contact" && (
                <Descriptions title="Contact Person Information" column={1} bordered size="small">
                  <Descriptions.Item label="Contact Name">{supplierData.ContactName || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Contact Email">{supplierData.ContactEmail || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Contact Phone">{supplierData.ContactPhone || '-'}</Descriptions.Item>
                </Descriptions>
              )}

              {activeTab === "product" && (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Input
                    placeholder="Search product in this supplier..."
                    prefix={<SearchOutlined />}
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    allowClear
                  />
                  <div style={{ color: '#595959', fontWeight: 500 }}>
                    Total Products: {filteredProducts.length} Items
                  </div>
                  <List
                    bordered
                    dataSource={filteredProducts}
                    rowKey={(prod: any) => prod.ID || prod.id}
                    renderItem={(product: any) => (
                      <List.Item key={product.ID || product.id}>
                        <div>
                          <strong>{product.Name || product.name || "Unnamed Product"}</strong>
                          {product.Stock < 10 && <Tag color="red" style={{ marginLeft: 8 }}>Low Stock</Tag>}
                          {product.Price !== undefined && (
                            <div style={{ color: '#595959', marginTop: 4 }}>
                              Price: {product.Price.toLocaleString()} ฿ <span style={{ color: '#d9d9d9' }}>|</span> Stock: {product.Stock}
                            </div>
                          )}
                        </div>
                      </List.Item>
                    )}
                  />
                </Space>
              )}
            </>
          )}
        </Content>
      </Layout>
    </Modal>
  );
};

export default ModalPreviewSup;