import React, { useEffect, useState } from 'react';
import { Table, Grid, Tag, Space, Button, Input, Layout, theme, message, DatePicker, Flex, Radio } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { Product, Transaction } from '../interfaces/allInterface';
import { Content } from 'antd/es/layout/layout';
import { AppSider } from '../components/AppSider';
import "../page/CustomTable.css";
import type { ColumnsType } from 'antd/es/table';
import HeaderPage from '../components/HeaderPage';
import ModalTrasection from '../components/product/ModalTransaction';
import { GetAllProduct, GetTransaction } from '../services/AllService';

const { useBreakpoint } = Grid;

export const TransectionPage: React.FC = () => {
  const screens = useBreakpoint();

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Transaction Date&Time',
      dataIndex: 'Transaction_CreateDate',
      key: 'Transaction_CreateDate',
      width: 100,
      ellipsis: true,
      align: 'center',
      render: (date: string) => date ? new Date(date).toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }).replace(',', '').replace(/\//g, '-') : '-',
    },
    {
      title: 'Type',
      dataIndex: 'Transaction_Type',
      key: 'Transaction_Type',
      width: 50,
      align: 'center',
      render: (type: string) => <Tag color={type === 'IN' ? 'green' : 'red'}>{type}</Tag>,
    },
    {
      title: 'Product & SKU',
      key: 'SKU',
      width: 100,
      align: 'center',
      render: (_: any, record: Transaction) => (
        <Space align="center" size={10}>
          <img
            src={record.Product?.ImageURL || ''}
            alt={record.SKU}
            width={45}
            height={45}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span>
            {record.SKU || '-'}
          </span>
        </Space>

      ),
    },
    {
      title: 'Quantity',
      key: 'Quantity',
      width: 100,
      align: 'center',
      render: (_: any, record: Transaction) => {
        const { Transaction_Type, Quantity } = record;
        if (Transaction_Type === 'IN') {
          return <Tag color="green">+{Quantity}</Tag>;
        }
        return <Tag color="red">-{Quantity}</Tag>;
      }
    },
    {
      title: 'EXP Date',
      dataIndex: 'EXP_Date',
      key: 'EXP_Date',
      width: 100,
      align: 'center',
      render: (date: string) => {
        if (!date) return '-';
        const [year, month, day] = date.split('T')[0].split('-');
        return `${day}-${month}-${year}`;
      },
    },
    {
      title: 'Reference',
      dataIndex: 'Reference',
      key: 'Reference',
      width: 120,
      align: 'center',
      render: (data: string) => data || '-'
    },
    {
      title: 'Reason',
      dataIndex: 'Reason',
      key: 'Reason',
      width: 120,
      align: 'center',
      render: (data: string) => data || '-'
    },
  ];

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [modalOpenTran, setModalTranOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>('');
  const [appliedSearchName, setAppliedSearchName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [datePreset, setDatePreset] = useState<string>('All Time');
  const [dateRange, setDateRange] = useState<any>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchData = async (page = 1, pageSize = 5, search = '', type = '', preset = '', dates: any = null) => {
    setLoading(true);
    try {
      const startDate = dates && dates[0] ? dates[0].format('YYYY-MM-DD') : undefined;
      const endDate = dates && dates[1] ? dates[1].format('YYYY-MM-DD') : undefined;
      const response = await GetTransaction({
        page: page,
        limit: pageSize,
        search: search,
        type: type,
        preset: preset === 'All Time' ? '' : preset,
        start_date: startDate,
        end_date: endDate,
      });

      setTransactions(response.data || []);
      setPagination({
        current: response.current_page || page,
        pageSize: response.limit || pageSize,
        total: response.total_items || 0,
      });

      const res = await GetAllProduct();
      const dataProduct = res.data ? res.data : res;
      setProductList(dataProduct);
    } catch (err) {
      console.error("Failed Fetch Data: ", err);
      message.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };
  const handlePresetChange = (e: any) => {
    const preset = e.target.value;
    setDatePreset(preset);
    setDateRange(null);
    fetchData(1, pagination.pageSize, appliedSearchName, selectedType, preset, null);
  };
  useEffect(() => {
    fetchData(1, pagination.pageSize, appliedSearchName, selectedType, datePreset, dateRange);
  }, [selectedType]);

  const handleSearch = () => {
    setAppliedSearchName(searchName);
    fetchData(1, pagination.pageSize, searchName, selectedType, datePreset, dateRange);
  };

  const handleResetSearch = () => {
    setSearchName('');
    setAppliedSearchName('');
    setSelectedType('');
    setDatePreset('All Time');
    setDateRange(null);
    fetchData(1, 5, '', '', '');
  };

  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize, appliedSearchName, selectedType, datePreset, dateRange);
  };

  const openModalTransaction = () => {
    setModalTranOpen(true);
  };
  const closeModalTransaction = () => {
    setModalTranOpen(false);
  };

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
            <Flex justify='space-between' align="center" style={{ marginBottom: '16px' }} wrap gap="middle">
              <Space wrap size="middle">
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  options={[
                    { value: "", label: 'ALL' },
                    { value: "IN", label: 'IN' },
                    { value: "OUT", label: 'OUT' },
                  ]}
                />

                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  value={datePreset}
                  onChange={handlePresetChange}
                  options={[
                    { value: "All Time", label: 'All Time' },
                    { value: "Today", label: 'Today' },
                    { value: "This Week", label: 'This Week' },
                    { value: "This Month", label: 'This Month' },
                  ]}
                />

                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  type={isSearchOpen ? 'primary' : 'default'}
                >
                  More Filters
                </Button>
              </Space>

              <Button type="primary" icon={<PlusOutlined />} onClick={openModalTransaction}>
                Add Transaction
              </Button>
            </Flex>

            {isSearchOpen && (
              <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#ffffff', borderRadius: borderRadiusLG }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr auto', gap: '12px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Product SKU / Reference:
                    </label>
                    <Input
                      placeholder="Search by SKU or Reference..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      onPressEnter={handleSearch}
                      allowClear
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Date Range:
                    </label>
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      value={dateRange}
                      onChange={(dates) => {
                        setDateRange(dates);
                        if (dates) {
                          setDatePreset('');
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                      Search
                    </Button>
                    <Button onClick={handleResetSearch}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div style={{
              background: colorBgContainer, borderRadius: borderRadiusLG, padding: '16px', width: '100%', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              <Table
                className="customTable"
                columns={columns}
                dataSource={transactions}
                rowKey="ID"
                loading={loading}
                scroll={{ x: 930 }}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  showTotal: (total) => `Total ${total} items`,
                }}
                onChange={handleTableChange}
              />
            </div>
          </Content>
        </Layout>
      </Layout>

      <ModalTrasection
        open={modalOpenTran}
        productList={productList}
        onClose={closeModalTransaction}
        onSuccess={() => fetchData(pagination.current, pagination.pageSize, appliedSearchName, selectedType, datePreset)}
      />
    </>
  );
};

export default TransectionPage;