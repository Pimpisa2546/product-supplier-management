import React, { useEffect, useState } from "react";
import { Category, Hazard, Velocity } from "../../interfaces/allInterface";
import { Space, Input, Button, Table, List, Tag, message, Popconfirm, Typography, Modal, Tabs } from "antd";
import { AddCategory, DeleteCategory, UpdateCategory } from "../../services/AllService";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';


interface ModalMasterProps{
    open: boolean;
    categoryList: Category[];
    hazardList: Hazard[];
    velocityList: Velocity[];
    onClose: () => void;
    onSuccess: () => void;
}
const { Text } = Typography;
export const ModalMaster: React.FC<ModalMasterProps> = (
    {open,onClose,categoryList,hazardList,velocityList,onSuccess}
) => {
    const [category, setCategory] = useState<Category[]>([]);

    const [activeMasterTab, setActiveMasterTab] = useState<string>('1');
    
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const [newCatName, setNewCatName] = useState<string>('');

    useEffect(() => {
    setCategory(categoryList);
  }, [categoryList]);

    const handleSaveCategory = async (data: { ID?: number; Name: string }) => {
       if (!data || !data.Name.trim()) {
         message.warning("Please enter category name");
         return;
       }
       const userId = localStorage.getItem('user');
       if (!userId) {
         alert('User session not found. Please log in again.');
         return;
       }
       const payload = {
         Name: data.Name.trim(),
         UserID: Number(userId)
       };

       if (data.ID) {
         try {
           await UpdateCategory(data.ID, payload);
           message.success("Update Category Success");
           onSuccess();
         } catch (err) {
           console.error("Failed Update Category: ", err);
           message.error("Failed Update Category");
         }
       } else {
         try {
           await AddCategory(payload);
           message.success("Add Category Success");
           onSuccess();
         } catch (err) {
           console.error("Failed Add Category: ", err);
           message.error("Failed Add Category");
         }
       }
     };

    const handleDeleteCategory = async (id: number) => {
      try {
        await DeleteCategory(id);
        message.success("Delete Category Success");
        onSuccess();
      } catch (err) {
        console.error("Failed Delete Category: ", err);
        message.error("Failed Delete Category");
      }
    };

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
            <List
              size="small"
              bordered
              dataSource={hazardList}
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
            <List
              size="small"
              bordered
              dataSource={velocityList}
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

  return(
    <Modal
        title="Master Data Management"
        open={open}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>Close</Button>
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
  );
};
export default ModalMaster;