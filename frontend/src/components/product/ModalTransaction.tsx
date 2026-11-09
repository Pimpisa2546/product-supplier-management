import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select } from "antd";
import { Product } from "../../interfaces/allInterface";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import { AddTransaction } from "../../services/AllService";
import TextArea from "antd/es/input/TextArea";

interface ModalTrasectionProps {
  open: boolean;
  productList: Product[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalTrasection: React.FC<ModalTrasectionProps> = ({ open, productList, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const handleCloseModal = () => {
    form.resetFields();
    onClose();
  };

  const transactionType = Form.useWatch('SelectType', form);

  const handleSaveTransaction = async (values: any) => {
    const isOut = values.SelectType === 'OUT';
    const payload = {
      Transaction_Type: values.SelectType,
      Quantity: values.stock,
      MFG_Date: !isOut && values.MFG ? values.MFG.tz('Asia/Bangkok').format('YYYY-MM-DD[T]00:00:00+07:00') : null,
      EXP_Date: !isOut && values.EXP ? values.EXP.tz('Asia/Bangkok').format('YYYY-MM-DD[T]00:00:00+07:00') : null,
      Transaction_CreateDate: dayjs().tz('Asia/Bangkok').format('YYYY-MM-DDTHH:mm:ss+07:00'),
      SKU: values.sku,
      ProductID: values.ProductID,
      Reason: values.reason,
      Reference: values.reference,
    };

    try {
      await AddTransaction(payload);
      message.success("Add Transaction Success");
      handleCloseModal();
      onSuccess();
    } catch (err: any) {
      console.error("Failed Transaction: --> ", err);
      message.error(err.response?.data?.error || "Failed Save Transaction");
    }
  };

  return (
    <Modal open={open} onCancel={handleCloseModal} title="Trasaction"
      footer={[
        <Button key="cancel" onClick={handleCloseModal}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>Save</Button>,
      ]}
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto', scrollbarWidth: 'thin' } }}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSaveTransaction}
        initialValues={{
          MFG: dayjs().tz('Asia/Bangkok'),
          EXP: dayjs().tz('Asia/Bangkok'),
        }}
      >
        <Form.Item name="ProductID" label="Product" rules={[{ required: true, message: 'Please select a product!' }]}>
          <Select placeholder="Select Product">
            {productList.map((c) => (<Select.Option key={c.ID} value={c.ID}>{c.SKU}</Select.Option>))}
          </Select>
        </Form.Item>

        <Form.Item name="SelectType" label="Transaction Type" rules={[{ required: true, message: 'Please select a transaction type!' }]}>
          <Radio.Group options={[{ value: "IN", label: 'IN' }, { value: "OUT", label: 'OUT' }]} />
        </Form.Item>

        <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input the stock!' }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        {transactionType === "IN" && (
          <>
            <Form.Item name="MFG" label="MFG Date">
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="EXP" label="EXP Date">
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}
        <Form.Item name="reference" label="Reference" rules={[{ required: true, message: 'Please enter reference number!' }]}>
          <Input placeholder="e.g. PO-202610-01 or INV-9988" />
        </Form.Item>

        <Form.Item name="reason" label="Reason">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalTrasection;