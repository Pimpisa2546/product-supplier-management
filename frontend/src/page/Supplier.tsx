import React, { useState } from "react";
import AppSider from "../components/AppSider";
import { Button, Layout, Space, Row, Card, Col, Avatar, Input, Popconfirm } from "antd";
import HeaderPage from "../components/HeaderPage";
import { DeleteOutlined, DownOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import { Supplier } from "../interfaces/allInterface";
import supplierLogic from "../customLogic/supplier";
import ModalPreviewSup from "../components/supplier/ModalPreviewSup";
import SupplierFormModal from "../components/supplier/ModalAddEditSup";

const { Meta } = Card;
const { Content } = Layout;

export const SupplierPage: React.FC = () => {
  const {
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
  } = supplierLogic();

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const actions = (item: Supplier): React.ReactNode[] => [
    <EditOutlined key="edit" onClick={() => handleEdit(item)} />,
    <EyeOutlined key="preview" onClick={() => handlePreviewSupID(item)} />,
    <Popconfirm
      key="delete"
      title="Are you sure to delete this supplier?"
      onConfirm={() => handleDeleteSupplier(item.ID)}
      okText="Yes"
      cancelText="No"
    >
      <DeleteOutlined style={{ color: '#ff4d4f' }} />
    </Popconfirm>,
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
                  Supplier Search
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
                        Supplier Name:
                      </label>
                      <Input
                        placeholder="Search by supplier name..."
                        value={searchName}
                        onChange={(e) => {
                          setSearchName(e.target.value);
                          if (!e.target.value) handleResetSearch();
                        }}
                        onPressEnter={handleSearch}
                      />
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

            <Space style={{ margin: '16px' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleModalOpen}>
                Add Supplier
              </Button>
            </Space>

            <div style={{ margin: '20px' }}>
              <Row gutter={[16, 16]}>
                {supplier.map((item) => (
                  <Col key={item.ID} xs={24} sm={12} md={12} lg={8} xl={6}>
                    <Card actions={actions(item)} loading={loading}>
                      <Meta
                        title={item.Name}
                        avatar={<Avatar src={item.ImageURL} size={90} />}
                        description={
                          <>
                            <p style={{ margin: 0 }}>Email: {item.Email}</p>
                            <p style={{ margin: 0 }}>Phone: {item.Phone}</p>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* Modal Add Edit */}
      <SupplierFormModal
        open={modalOpen}
        editSup={editSup}
        onClose={handleModalClose}
        onSuccess={handleSaveSuccess}
      />

      <ModalPreviewSup
        open={modalPreOpen}
        supplierId={selectedSupId}
        onClose={handlePreviewClose}
      />
    </>
  );
};

export default SupplierPage;