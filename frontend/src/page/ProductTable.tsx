import React, { useState } from 'react';
import { Table, Grid, Tag, Space, Button, Input, Select, Popconfirm, Layout, theme, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, SearchOutlined, UpOutlined, DownOutlined, EyeOutlined } from '@ant-design/icons';
import { Category, Product } from '../interfaces/allInterface';
import useProductManager from "../customLogic/productAndData";
import { Content } from 'antd/es/layout/layout';
import { AppSider } from '../components/AppSider';
import "../page/CustomTable.css";
import type { ColumnsType } from 'antd/es/table';
import HeaderPage from '../components/HeaderPage';
import ModalPreview from '../components/product/ModalPreview';
import ModalAddEditProduct from '../components/product/ModalAddEdit';
import ModalMaster from '../components/masterData/MasterData';

const { useBreakpoint } = Grid;

export const ProductTable: React.FC = () => {
  const {
    handleDelete,
    handleCloseModal,
    handleEdit,
    openCreateModal,
    handleOpenMasterData,
    handleCloseMasterData,
    handleSearch,
    handleResetSearch,
    fetchData,
    fetchMasterData,

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
  } = useProductManager();

  const screens = useBreakpoint();

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const handleOpen = (id?: number) => {
    if (!id) return;
    setSelectedProductId(id);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedProductId(null);
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      width: 200,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
      width: 100,
      align: 'center',
      render: (price: number) => `฿${price?.toLocaleString() ?? 0}`,
    },
    {
      title: 'Stock',
      dataIndex: 'Stock',
      key: 'Stock',
      width: 100,
      align: 'center',
      render: (stock: number) => <Tag color={stock > 0 ? 'green' : 'red'}>{stock}</Tag>,
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'Category',
      width: 160,
      align: 'center',
      render: (cat: Category) => cat?.Name || '-',
    },
    {
      title: 'Action',
      key: 'Action',
      width: 120,
      align: 'center',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleOpen(record.ID)}/>
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            style={{ borderColor: '#eab308', color: '#eab308' }}
          />
          <Popconfirm title="Are you sure to delete this product?" onConfirm={() => handleDelete(record.ID!)} okText="Yes" cancelText="No">
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      fixed: screens.md ? "right" : undefined,
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout hasSider style={{ minHeight: "100vh" }}>
        <AppSider />
        <Layout style={{ minHeight: '100vh', width: 0, flex: 1, background: '#f5f5f5' }}>
          <HeaderPage />
          <Content style={{ margin: "16px" }}>
            <Card style={{ marginBottom: '20px' }}>
              <div
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '16px'
                }}
              >
                <span>
                  <SearchOutlined style={{ marginRight: '8px' }} />
                  Product Search
                </span>
                {isSearchOpen ? <UpOutlined /> : <DownOutlined />}
              </div>

              {isSearchOpen && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                        Product Name:
                      </label>
                      <Input
                        placeholder="Search by product name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onPressEnter={handleSearch}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                        Category:
                      </label>
                      <Select
                        style={{ width: '100%' }}
                        value={selectedCategory || undefined}
                        onChange={(val) => setSelectedCategory(val || '')}
                        placeholder="-- All Categories --"
                        allowClear
                      >
                        {category.map((cat) => (
                          <Select.Option key={cat.ID} value={String(cat.ID)}>
                            {cat.Name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                        Hazard Level:
                      </label>
                      <Select
                        style={{ width: '100%' }}
                        value={selectedHazard || undefined}
                        onChange={(val) => setSelectedHazard(val || '')}
                        placeholder="-- All Hazard Levels --"
                        allowClear
                      >
                        {hazard.map((hz) => (
                          <Select.Option key={hz.ID} value={String(hz.ID)}>
                            {hz.Name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                        Velocity Rate:
                      </label>
                      <Select
                        style={{ width: '100%' }}
                        value={selectedVelocity || undefined}
                        onChange={(val) => setSelectedVelocity(val || '')}
                        placeholder="-- All Velocity Rates --"
                        allowClear
                      >
                        {velocity.map((vel) => (
                          <Select.Option key={vel.ID} value={String(vel.ID)}>
                            {vel.Name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button type="primary" onClick={handleSearch}>
                      Search
                    </Button>
                    <Button onClick={handleResetSearch}>
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Space style={{ marginBottom: '16px' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                Add Product
              </Button>
              <Button type="default" icon={<SettingOutlined />} onClick={handleOpenMasterData}>
                Manage Master Data
              </Button>
            </Space>

            <div style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              width: '100%',
              overflow: 'hidden'
            }}>
              <Table
                className="customTable"
                columns={columns}
                dataSource={products}
                rowKey="ID"
                loading={loading}
                scroll={{ x: 930 }}
                pagination={{
                  pageSize: 5,
                  showTotal: (total) => `Total ${total} items`,
                }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>

      <ModalAddEditProduct
        open={modalOpen}
        editingProduct={editingProduct}
        supplierList={supplier}
        categoryList={category}
        hazardList={hazard}
        velocityList={velocity}
        onClose={handleCloseModal}
        onSuccess={fetchData}
      />
      
      <ModalMaster
        open={modalMaster}
        categoryList={category}
        hazardList={hazard}
        velocityList={velocity}
        onClose={handleCloseMasterData}
        onSuccess={fetchMasterData}
      />

      <ModalPreview 
        open={previewOpen}
        productId={selectedProductId}
        onClose={handleClosePreview}
      />
    </>
  );
};

export default ProductTable;