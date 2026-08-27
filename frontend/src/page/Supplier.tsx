import React, { useState } from "react";
import AppSider from "../layout/AppSider";
import { Button, Layout, Modal, Space, Form, Row, Card, Col, Avatar, Input, Upload, Steps, Menu, MenuProps, Descriptions, Grid, Image, Popconfirm } from "antd";
import HeaderPage from "../layout/HeaderPage";
import { DeleteOutlined, DownOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined, ShopOutlined, UpOutlined, UserOutlined } from "@ant-design/icons";
import { Supplier } from "../interfaces/allInterface";
import ImgCrop from "antd-img-crop";
import { handleImagePreview } from "../customLogic/uploadImage";
import supplierLogic from "../customLogic/supplier";

const { Meta } = Card;
type MenuItem = Required<MenuProps>['items'][number];
const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const SupplierPage: React.FC = () => {
    const {
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
    }=supplierLogic();

    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const screens = useBreakpoint();

    const getResponsiveWidth = () => {
        if (screens.xxl) return '40%';
        if (screens.xl) return '50%';
        if (screens.lg) return '60%';
        if (screens.md) return '70%';
        if (screens.sm) return '80%';
        return '90%';
    };

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

    const items: MenuItem[] = [
        {
            key: 'supplier',
            label: 'Supplier',
            icon: <ShopOutlined /> ,
        },
        {
            key: 'contact',
            label: 'Contact',
            icon: <UserOutlined />,
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
                                placeholder="Search by product name..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
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
                                    <Col key={item.ID} xs={24}sm={12}md={12}lg={8} xl={6}>
                                        <Card actions={actions(item)} loading={loading}>
                                            <Meta title={item.Name}
                                                avatar={<Avatar src={item.ImageURL} size={90} />}
                                                description={
                                                    <>
                                                        <p>Email: {item.Email}</p>
                                                        <p>Phone: {item.Phone}</p>
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

            {/* Modal Add / Edit */}
            <Modal
                open={modalOpen}
                onCancel={handleModalClose}
                title={editSup ? 'Edit Supplier' : 'Add Supplier'}
                footer={[
                    <Button key="back" onClick={handlePrev} disabled={currentPage === 1}>
                        Back
                    </Button>,
                    currentPage < totalPage && (
                        <Button key="next" type="primary" onClick={handleNext}>
                            Next
                        </Button>
                    ),
                    currentPage === totalPage && (
                        <Button key="submit" type="primary" onClick={() => form.submit()}>
                            {editSup ? 'Update' : 'Add Supplier'}
                        </Button>
                    ),
                ]}
            >
                <Steps
                    size="small"
                    current={currentPage - 1}
                    style={{ marginBottom: 24, marginTop: 12 }}
                    items={[
                        { title: 'Supplier' },
                        { title: 'Contact' },
                    ]}
                />

                <Form form={form} layout="vertical" onFinish={handleSaveSupplier}>
                    <div style={{ display: currentPage === 1 ? 'block' : 'none' }}>
                        <Form.Item name="supplierName" label="Supplier Name" rules={[{ required: true, message: 'Please input the supplier name!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="supplierEmail" label="Supplier Email" rules={[{ type: 'email', required: true, message: 'Please input a valid Email!' }]}>
                            <Input placeholder="example@supplier.com" />
                        </Form.Item>
                        <Form.Item
                            name="supplierPhone" label="Supplier Phone"
                            normalize={(value) => value ? value.replace(/\D/g, '') : ''}
                            rules={[
                                { required: true, message: 'Please input Phone number!' },
                                { len: 10, message: 'Phone number must be exactly 10 digits!' }
                            ]}
                        >
                            <Input placeholder="0812345678" maxLength={10} />
                        </Form.Item>
                        <Form.Item name="supplierAddress" label="Supplier Address" rules={[{ required: true, message: 'Please input the supplier Address!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Supplier Image">
                            <ImgCrop rotationSlider>
                                <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onChange}
                                    onPreview={handleImagePreview}
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
                    </div>

                    <div style={{ display: currentPage === 2 ? 'block' : 'none' }}>
                        <Form.Item name="contactName" label="Contact Name" rules={[{ required: true, message: 'Please input the contact name!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="contactEmail" label="Contact Email" rules={[{ type: 'email', required: true, message: 'Please input a valid Email!' }]}>
                            <Input placeholder="example@supplier.com" />
                        </Form.Item>
                        <Form.Item
                            name="contactPhone" label="Contact Phone"
                            normalize={(value) => value ? value.replace(/\D/g, '') : ''}
                            rules={[
                                { required: true, message: 'Please input Phone number!' },
                                { len: 10, message: 'Phone number must be exactly 10 digits!' }
                            ]}
                        >
                            <Input placeholder="0812345678" maxLength={10} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            {/* Modal Preview Supplier */}
            <Modal
                title="Supplier Preview"
                open={modalPreOpen}
                onCancel={handlePreviewClose}
                width={getResponsiveWidth()}
                footer={null}
            >
                <Layout style={{ background: '#ffffff', marginTop: 16 }}>
                    <Sider width={130} style={{ background: "#ffffff", borderRight: '1px solid #f0f0f0' }}>
                        <Menu
                            theme="light"
                            style={{ width: '100%', borderRight: 0}}
                            selectedKeys={[activeTab]}
                            mode="inline"
                            items={items}
                            onClick={(e) => setActiveTab(e.key)}
                        />
                    </Sider>

                    <Content style={{ padding: '0 16px', minHeight: 250, background: '#ffffff' }}>
                        {supplierById.map((item) => (
                            <React.Fragment key={item.ID}>
                                {activeTab === "supplier" && (
                                    <Descriptions title="Supplier Information" column={1} bordered size="small">
                                        <Descriptions.Item label="Image">
                                            <Image width={100} src={item.ImageURL} fallback="https://via.placeholder.com/100" />
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Name">{item.Name || '-'}</Descriptions.Item>
                                        <Descriptions.Item label="Email">{item.Email || '-'}</Descriptions.Item>
                                        <Descriptions.Item label="Phone">{item.Phone || '-'}</Descriptions.Item>
                                        <Descriptions.Item label="Address">{item.Address || '-'}</Descriptions.Item>
                                    </Descriptions>
                                )}

                                {activeTab === "contact" && (
                                    <Descriptions title="Contact Person Information" column={1} bordered size="small">
                                        <Descriptions.Item label="Contact Name">{item.ContactName || '-'}</Descriptions.Item>
                                        <Descriptions.Item label="Contact Email">{item.ContactEmail || '-'}</Descriptions.Item>
                                        <Descriptions.Item label="Contact Phone">{item.ContactPhone || '-'}</Descriptions.Item>
                                    </Descriptions>
                                )}
                            </React.Fragment>
                        ))}
                    </Content>
                </Layout>
            </Modal>
        </>
    );
};

export default SupplierPage;