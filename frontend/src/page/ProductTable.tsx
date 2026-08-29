import React, { useState } from 'react';
import { 
  Table, Grid, Tag, Space, Button, Modal, Form, InputNumber, Input, 
  Select, Popconfirm, Avatar, Upload, Layout, theme, Tabs, List, Typography, Card 
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, WarningOutlined, RocketOutlined, CheckOutlined, CloseOutlined, SearchOutlined, UpOutlined, DownOutlined, EyeOutlined } from '@ant-design/icons';
import { Category, Product } from '../interfaces/allInterface';
import TextArea from 'antd/es/input/TextArea';
import ImgCrop from 'antd-img-crop';
import useProductManager from "../customLogic/productAndData";
import { Content } from 'antd/es/layout/layout';
import { AppSider } from '../components/AppSider';
import "../page/CustomTable.css";
import type { ColumnsType } from 'antd/es/table';
import HeaderPage from '../components/HeaderPage';

const { Text } = Typography;
const { useBreakpoint } = Grid;

export const ProductTable: React.FC = () => {
  const {
    onChange,
    onPreview,
    handleSaveProduct,
    handleDelete,
    handleCloseModal,
    handleEdit,
    openCreateModal,
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
    products,
    supplier,
    hazard,
    category,
    velocity,
    fileList,

    form,
  } = useProductManager();

  const screens = useBreakpoint();
  const [activeMasterTab, setActiveMasterTab] = useState<string>('1');

  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [newCatName, setNewCatName] = useState<string>('');

  const startEditCategory = (record: Category) => {
    setEditingKey(record.ID!);
    setEditingName(record.Name || '');
  };

  const cancelEditCategory = () => {
    setEditingKey(null);
    setEditingName('');
  };

  const saveEditCategory = async (id: number) => {
    if (!editingName.trim()) return;
    await handleSaveCategory({ ID: id, Name: editingName });
    cancelEditCategory();
  };

  const handleAddNewCategory = async () => {
    if (!newCatName.trim()) return;
    await handleSaveCategory({ Name: newCatName });
    setNewCatName('');
  };

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'ImageURL',
      key: 'ImageURL',
      width: 90,
      align: 'center',
      render: (url: string) => (
        <Avatar
          shape="square"
          size={50}
          src={url || 'https://via.placeholder.com/40?text=No+Image'}
        />
      ),
      fixed: screens.md ? "left" : undefined,
    },
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
      render: (cat: any) => cat?.Name || '-',
    },
    {
      title: 'Supplier',
      dataIndex: 'Supplier',
      key: 'Supplier',
      width: 180,
      align: 'center',
      render: (sup: any) => sup?.Name || '-',
    },
    {
      title: 'Action',
      key: 'Action',
      width: 100,
      align: 'center',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />}/>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} 
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

  const columnsMaster = [
    {
      title: 'Category Name',
      dataIndex: 'Name',
      key: 'Name',
      render: (text: string, record: Category) => {
        const isEditing = record.ID === editingKey;
        return isEditing ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onPressEnter={() => saveEditCategory(record.ID!)}
            autoFocus
            size="small"
          />
        ) : (
          text
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: Category) => {
        const isEditing = record.ID === editingKey;
        return isEditing ? (
          <Space size="small">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => saveEditCategory(record.ID!)}
            />
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={cancelEditCategory}
            />
          </Space>
        ) : (
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => startEditCategory(record)}
            />
            <Popconfirm
              title="Are you sure to delete this category?"
              onConfirm={() => handleDeleteCategory(record.ID!)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const masterTabItems = [
    {
      key: '1',
      label: 'Category',
      children: (
        <div style={{ paddingTop: '8px' }}>
          <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'center' }}>
            <Input
              placeholder="Enter new category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onPressEnter={handleAddNewCategory}
              style={{ width: '300px' }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNewCategory}
            >
              Add
            </Button>
          </Space>
          <Table
            dataSource={category}
            rowKey="ID"
            pagination={{ pageSize: 5 }}
            size="small"
            columns={columnsMaster}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Hazard Level',
      children: (
        <div style={{ paddingTop: '8px' }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            <WarningOutlined style={{ color: '#faad14', marginRight: 6 }} />
            Static Master Data (Referenced by risk standard, read-only)
          </Text>
          <List
            size="small"
            bordered
            dataSource={hazard}
            renderItem={(item: any) => (
              <List.Item key={item.ID}>
                <Space>
                  <Tag color="volcano">{item.Code || item.ID}</Tag>
                  <Text>{item.Name}</Text>
                </Space>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Velocity Rate',
      children: (
        <div style={{ paddingTop: '8px' }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            <RocketOutlined style={{ color: '#1890ff', marginRight: 6 }} />
            Static Master Data (ABC Analysis inventory turnover criteria)
          </Text>
          <List
            size="small"
            bordered
            dataSource={velocity}
            renderItem={(item: any) => (
              <List.Item key={item.ID}>
                <Space>
                  <Tag color="blue">{item.Code || item.ID}</Tag>
                  <Text>{item.Name}</Text>
                </Space>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

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

      <Modal
        title={editProduct ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={handleCloseModal}
        centered
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={() => { form.submit(); }}>
            {editProduct ? 'Update Product' : 'Add Product'}
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
                //action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
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
              {supplier.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="CategoryID" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
            <Select placeholder="Select Category">
              {category.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="HazardID" label="Hazard Level" rules={[{ required: true, message: 'Please select a hazard level!' }]}>
            <Select placeholder="Select Hazard Level">
              {hazard.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="VelocityID" label="Velocity Rate" rules={[{ required: true, message: 'Please select a velocity rate!' }]}>
            <Select placeholder="Select Velocity Rate">
              {velocity.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.Name}</Select.Option>))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Master Data Management"
        open={modalMaster}
        onCancel={handleCloseMasterData}
        footer={[
          <Button key="close" onClick={handleCloseMasterData}>Close</Button>
        ]}
        width={650}
        centered
      >
        <Tabs
          activeKey={activeMasterTab}
          onChange={setActiveMasterTab}
          items={masterTabItems}
        />
      </Modal>
    </>
  );
};

export default ProductTable;