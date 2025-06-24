import React, { useEffect, useState, useRef, useCallback } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Row, Col } from "antd";
import MainPage from "../component/page/MainPage";
import { Config, isEmptyOrNull } from "../config/helper";
import dayjs from "dayjs";
import { CloseOutlined, UploadOutlined, EyeOutlined } from "@ant-design/icons";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const { TextArea } = Input;

const DosAdminPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [formCat] = Form.useForm();
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const filterRef = useRef({ txt_search: "" });
    const fileRef = useRef(null);

    useEffect(() => {
        formCat.setFieldsValue({ status: "1" });
        getList();
    }, []);

    const getList = useCallback(async () => {
        setLoading(true);
        const param = { txt_search: filterRef.current.txt_search };
        try {
            const res = await request("documents/getList", "get", param);
            if (res) setList(res.list);
        } catch (error) {
            message.error('Failed to fetch the list.');
        } finally {
            setLoading(false);
        }
    }, []);

    // const onClickBtnEdit = (item) => {
    //     formCat.setFieldsValue({ ...item, file: item.file_path });
    //     setFilePreview(Config.image_path + item.file_path);
    //     setOpen(true);
    // };

    const onClickBtnEdit = (item) => {
    formCat.setFieldsValue({ ...item, file: item.file_path });

    // Directly use the URL for filePreview
    const pdfUrl = Config.image_path + item.file_path;
    setFilePreview(pdfUrl);

    setOpen(true);
    };


    const onClickBtnDelete = async (item) => {
        Modal.confirm({
            title: "លុប",
            content: "តើលោកអ្នកចង់លុបមែន ឬទេ?",
            okText: "លុប",
            cancelText: "បដិសេធ",
            okType: "danger",
            centered: true,
            onOk: async () => {
                const data = { id: item.id };
                try {
                    const res = await request("documents/delete", "delete", data);
                    if (res) {
                        message.success(res.message);
                        getList();
                    }
                } catch (error) {
                    message.error('Failed to delete the item.');
                }
            }
        });
    };

    const onTextSearch = (value) => {
        filterRef.current.txt_search = value;
        getList();
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const onCloseModule = () => {
        formCat.resetFields();
        formCat.setFieldsValue({ status: "1" });
        setOpen(false);
        setFilePreview(null);
        setFileSelected(null);
    };

    const onRemoveFileSelected = () => {
        fileRef.current.value = null;
        setFilePreview(null);
        setFileSelected(null);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            setFileSelected(file);
            setFilePreview(url);
        } else {
            message.error('Please select a valid PDF file.');
            setFileSelected(null);
            setFilePreview(null);
        }
    };

    const onFinish = async (item) => {
        const id = formCat.getFieldValue("id");
        const form = new FormData();
        form.append("id", id);
        form.append("title", item.title);
        form.append("description", item.description);
        form.append("status", item.status);
        form.append("PreImage", formCat.getFieldValue("file"));

        if (fileSelected) form.append("file", fileSelected);

        const method = id == null ? "post" : "put";
        const url = id == null ? "documents/create" : "documents/update";

        try {
            const res = await request(url, method, form);
            if (res) {
                message.success(res.message);
                getList();
                onCloseModule();
            }
        } catch (error) {
            message.error('Failed to save the document.');
        }
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title"> ឯកសាររដ្ឋបាល</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                </Space>
                <Button onClick={() => setOpen(true)} type="primary">បន្ថែមថ្មី</Button>
            </div>
            <hr />
            <Table
                dataSource={list}
                pagination={{ pageSize: 4 }}
                columns={[
                    { key: "No", title: "ល.រ", render: (_, __, index) => index + 1 },
                    { key: "title", title: "ចំណង់ជើង", dataIndex: "title" },
                    { key: "description", title: "មាតិកា", dataIndex: "description" },
                    {
                        key: "file_path", title: "ឯកសារ", dataIndex: "file_path", render: (value) => (
                            <Button icon={<EyeOutlined />} onClick={() => window.open(Config.image_path + value, '_blank')}>
                                View
                            </Button>
                        )
                    },
                    {
                        key: "Action", title: "ប្រតិបត្តិការណ៍", render: (_, item) => (
                            <Space>
                                <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                            </Space>
                        )
                    }
                ]}
            />

            <Modal
                title={formCat.getFieldValue("id") == null ? "បន្ថែមឯកសារ" : "កែប្រែឯកសារ"}
                open={open}
                onCancel={onCloseModule}
                footer={null}
                width="50%"
                maskClosable={false}
            >
                <Form form={formCat} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="ចំណង់ជើង"
                        name="title"
                        rules={[{ required: true, message: "សូមបំពេញចំណង់ជើង!" }]}
                    >
                        <Input placeholder="ចំណង់ជើង" />
                    </Form.Item>

                    <Form.Item
                        label="មាតិកា"
                        name="description"
                        rules={[{ required: true, message: "សូមបំពេញមាតិកា!" }]}
                    >
                        <TextArea placeholder="មាតិកា" rows={4} />
                    </Form.Item>

                    <Form.Item label="ឯកសារ PDF">
                        <div style={{ position: 'relative', width: '100%' }}>
                           {filePreview ? (
    <div style={{ border: "1px solid #ccc", borderRadius: 4, height: 300, overflow: "auto" }}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={filePreview} key={filePreview} />
        </Worker>
        <CloseOutlined
            onClick={onRemoveFileSelected}
            style={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'red',
                fontSize: 20,
                background: '#fff',
                borderRadius: '50%',
                padding: 4,
                cursor: 'pointer'
            }}
        />
    </div>
) : (
    <div style={{ backgroundColor: '#f0f0f0', padding: 16, textAlign: 'center', border: '1px dashed #ccc' }}>
        <span>មិនមានឯកសារ</span>
    </div>
)}

                        </div>

                        <input
                            type="file"
                            accept="application/pdf"
                            ref={fileRef}
                            id="selectedFile"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <Button
                            icon={<UploadOutlined />}
                            onClick={() => document.getElementById('selectedFile').click()}
                            style={{ marginTop: 10, width: "50%" }}
                        >
                            Browse...
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModule}>បដិសេធ</Button>
                            <Button type="primary" htmlType="submit">រក្សាទុក</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </MainPage>
    );
};

export default DosAdminPage;