import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Steps, Button, message, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { Supplier } from "../../interfaces/allInterface";
import { AddNewSupplier, UpdateSupplier } from "../../services/AllService";
import { getBase64, handleImagePreview } from "../../customLogic/uploadImage";

interface SupplierFormModalProps {
  open: boolean;
  editSup: Supplier | null;
  onClose: () => void;
  onSuccess: (updatedSupplier: Supplier, isEdit: boolean) => void;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  open,
  editSup,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const totalPage = 2;

  useEffect(() => {
    if (open) {
      if (editSup) {
        if (editSup.ImageURL) {
          setFileList([
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: editSup.ImageURL,
            },
          ]);
        } else {
          setFileList([]);
        }

        form.setFieldsValue({
          supplierName: editSup.Name,
          supplierPhone: editSup.Phone,
          supplierEmail: editSup.Email,
          imageURL: editSup.ImageURL,
          supplierAddress: editSup.Address,
          contactName: editSup.ContactName,
          contactPhone: editSup.ContactPhone,
          contactEmail: editSup.ContactEmail,
        });
      } else {
        form.resetFields();
        setFileList([]);
      }
      setCurrentPage(1);
    }
  }, [open, editSup, form]);

  const handleNext = async () => {
    try {
      if (currentPage === 1) {
        await form.validateFields([
          "supplierName",
          "supplierEmail",
          "supplierPhone",
          "supplierAddress",
        ]);
      }
      if (currentPage < totalPage) setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const onChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (!newFileList || newFileList.length === 0) {
      form.setFieldsValue({ imageURL: "" });
      return;
    }
    const latestFile = newFileList[newFileList.length - 1];
    if (latestFile.url) {
      form.setFieldsValue({ imageURL: latestFile.url });
      return;
    }
    if (latestFile.status === "done" && latestFile.response?.url) {
      form.setFieldsValue({ imageURL: latestFile.response.url });
      return;
    }
    if (latestFile.originFileObj) {
      const base64 = await getBase64(latestFile.originFileObj as any);
      form.setFieldsValue({ imageURL: base64 });
      return;
    }
  };

  const handleSaveSupplier = async (values: any) => {
    setSubmitting(true);
    const payload = {
      Name: values.supplierName,
      Phone: values.supplierPhone,
      Email: values.supplierEmail,
      ImageURL: values.imageURL,
      Address: values.supplierAddress,
      ContactName: values.contactName,
      ContactPhone: values.contactPhone,
      ContactEmail: values.contactEmail,
    };

    if (editSup) {
      try {
        const updateResult = await UpdateSupplier(editSup.ID!, payload);
        const updatedItem = { ...editSup, ...payload, ...updateResult };
        message.success("Update Supplier Success");
        onSuccess(updatedItem, true);
        onClose();
      } catch (err) {
        console.error("Failed Update Supplier: ", err);
        message.error("Failed Update Supplier");
      } finally {
        setSubmitting(false);
      }
    } else {
      try {
        const addNewSupplier = await AddNewSupplier(payload);
        message.success("Add Supplier Success");
        onSuccess(addNewSupplier, false);
        onClose();
      } catch (err) {
        console.error("Failed Add Supplier: ", err);
        message.error("Failed Add Supplier");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={editSup ? "Edit Supplier" : "Add Supplier"}
      centered
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
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
          >
            {editSup ? "Update" : "Add Supplier"}
          </Button>
        ),
      ]}
    >
      <Steps
        size="small"
        current={currentPage - 1}
        style={{ marginBottom: 24, marginTop: 12 }}
        items={[{ title: "Supplier" }, { title: "Contact" }]}
      />

      <Form form={form} layout="vertical" onFinish={handleSaveSupplier}>
        <Form.Item name="imageURL" hidden>
          <Input />
        </Form.Item>

        <div style={{ display: currentPage === 1 ? "block" : "none" }}>
          <Form.Item
            name="supplierName"
            label="Supplier Name"
            rules={[{ required: true, message: "Please input the supplier name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="supplierEmail"
            label="Supplier Email"
            rules={[
              { type: "email", required: true, message: "Please input a valid Email!" },
            ]}
          >
            <Input placeholder="example@supplier.com" />
          </Form.Item>
          <Form.Item
            name="supplierPhone"
            label="Supplier Phone"
            normalize={(value) => (value ? value.replace(/\D/g, "") : "")}
            rules={[
              { required: true, message: "Please input Phone number!" },
              { len: 10, message: "Phone number must be exactly 10 digits!" },
            ]}
          >
            <Input placeholder="0812345678" maxLength={10} />
          </Form.Item>
          <Form.Item
            name="supplierAddress"
            label="Supplier Address"
            rules={[{ required: true, message: "Please input the supplier Address!" }]}
          >
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

        <div style={{ display: currentPage === 2 ? "block" : "none" }}>
          <Form.Item
            name="contactName"
            label="Contact Name"
            rules={[{ required: true, message: "Please input the contact name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactEmail"
            label="Contact Email"
            rules={[
              { type: "email", required: true, message: "Please input a valid Email!" },
            ]}
          >
            <Input placeholder="example@supplier.com" />
          </Form.Item>
          <Form.Item
            name="contactPhone"
            label="Contact Phone"
            normalize={(value) => (value ? value.replace(/\D/g, "") : "")}
            rules={[
              { required: true, message: "Please input Phone number!" },
              { len: 10, message: "Phone number must be exactly 10 digits!" },
            ]}
          >
            <Input placeholder="0812345678" maxLength={10} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default SupplierFormModal;