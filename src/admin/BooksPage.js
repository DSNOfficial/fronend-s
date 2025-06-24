import React, { useEffect, useState, useRef, useCallback } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Row, Col } from "antd";
import MainPage from "../component/page/MainPage";
import { Config, isEmptyOrNull } from "../config/helper";
import dayjs from "dayjs";
import { CloseOutlined, UploadOutlined, EyeOutlined, DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { PDFDocument, rgb } from 'pdf-lib';
import generateUniqueId from 'generate-unique-id';

const { TextArea } = Input;

const BooksPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [firstPageNumber, setFirstPageNumber] = useState(null);
    const [formCat] = Form.useForm();
    const filterRef = useRef({ txt_search: "" });
    const fileRef = useRef(null);
    const printIframeRef = useRef(null);
    const [viewPDF, setViewPDF] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);

    useEffect(() => {
        formCat.setFieldsValue({ status: "1" });
        getList();
    }, []);

    const getList = useCallback(async () => {
        setLoading(true);
        const param = { txt_search: filterRef.current.txt_search };
        try {
            const res = await request("book/getlist", "get", param);
            if (res) setList(res.list);
        } catch (error) {
            message.error('Failed to fetch the list.');
        } finally {
            setLoading(false);
        }
    }, []);

    const onViewPDF = (url) => {
        setFileUrl(url);
        setViewPDF(true);
    };

    const onCloseViewPDF = () => {
        setViewPDF(false);
        setFileUrl(null);
    };

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({
            ...item,
            file: item.file_path,
        });
        setFilePreview(Config.image_path + item.file_path);
        setOpen(true);
        console.log(item);
    };

    const onClickBtnViewDetail = (item) => {
        setSelectedItem(item);
        setDetailOpen(true);
    };

    const toKhmerNumeral = (num) => {
        const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        return num.toString().split('').map(digit => khmerNumerals[digit]).join('');
    };

    const formatKhmerDate = (date) => {
        const day = toKhmerNumeral(dayjs(date).date());
        const month = dayjs(date).locale('km').format('MMMM');
        const year = toKhmerNumeral(dayjs(date).year());
        return `ថ្ងៃទី${day} ខែ${month} ${year}`;
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
                    const res = await request("book/delete", "delete", data);
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

    const editPdf = async (fileUrl) => {
        try {
            const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const { width, height } = firstPage.getSize();

            firstPage.drawText('Edited with pdf-lib!', {
                x: 50,
                y: height / 2,
                size: 30,
                color: rgb(0, 0.53, 0.71),
            });

            const pdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);

            setFilePreview(pdfUrl);
            message.success('PDF edited successfully!');
        } catch (error) {
            message.error('Failed to edit the PDF.');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const fileUrl = URL.createObjectURL(file);
            setFileSelected(file);
            setFilePreview(fileUrl);
        } else {
            message.error('Please select a valid PDF file.');
            setFileSelected(null);
            setFilePreview(null);
        }
    };
    const uniqueId = (prefix = 'id-') =>
        prefix + Math.random().toString(16).slice(-4)

    const onFinish = async (item) => {
        const id = formCat.getFieldValue("id");
        const form = new FormData();
        form.append("id", id);
        form.append("title", item.title);
        form.append("description", item.description);
        form.append("status", item.status);
        form.append("PreImage", formCat.getFieldValue("file"));
    
        // Generate unique code
        // const uniqueCode = generateUniqueId({
        //     length: 10,
        //     useLetters: true,
        //     useNumbers: true,
        // });
        form.append("code",item.code || uniqueId);
        // item.code || generateUniqueCode());
    
        if (fileSelected) form.append("file", fileSelected);
    
        const method = id == null ? "post" : "put";
        const url = id == null ? "book/create" : "book/update";
    
        try {
            const res = await request(url, method, form);
            if (res) {
                message.success(res.message);
                getList();
                onCloseModule();
                // Avoid window.location.reload(); as it's unnecessary and can disrupt UX
            }
        } catch (error) {
            message.error('Failed to save the book.');
        }
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

    const onClickBtnView = (pdf) => {
        const fileUrl = Config.image_path + pdf;
        window.open(fileUrl, '_blank');
    };

    const onPrintPdf = (fileUrl) => {
        if (printIframeRef.current) {
            printIframeRef.current.src = fileUrl;
            printIframeRef.current.onload = () => {
                printIframeRef.current.contentWindow.print();
            };
        }
    };


    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title"> សេចក្តីប្រកាស</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                </Space>
                <Button onClick={() => setOpen(true)} type="primary">បន្ថែមថ្មី</Button>
            </div>
            <hr />
            <Table
                dataSource={list}
                pagination={{ pageSize: 7 }}
                columns={[
                    { key: "No", title: "ល.រ", dataIndex: "title", render: (value, item, index) => (index + 1) },
               
                    { key: "title", title: "ចំណង់ជើង", dataIndex: "title" },
                    { key: "description", title: "មាតិកា", dataIndex: "description" },
                    {
                        key: "createdAt",
                        title: "ថ្ងៃបង្កើត",
                        dataIndex: "createdAt",
                        render: (value) => formatKhmerDate(value)
                    },
                    // { key: "uniqueId", title: "កូដ", dataIndex: "codeuniqueId" },
                    {
                        key: "file_path", title: "ឯកសារ", dataIndex: "file_path", render: (value, item) => (

                            <Space>

                                   <Button icon={<EyeOutlined />} onClick={() => onViewPDF(Config.image_path + item.file_path)}>
                                    View
                                </Button>
                                {/* <a href={Config.image_path + item.file_path} download>
                                    <Button icon={<DownloadOutlined />} />
                                </a>
                                <Button onClick={() => onPrintPdf(Config.image_path + value)} icon={<PrinterOutlined />} /> */}
                            </Space>
                        )
                   

                    },
                    {
                        key: "Action", title: "ប្រតិបត្តិការណ៍", dataIndex: "Status", render: (value, item) => (
                            <Space>
                                {/* <Button onClick={() => onClickBtnViewDetail(item)}>មើលលម្អិត</Button> */}
                                <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                            </Space>
                        )
                    }
                ]}
            />
            <iframe
                ref={printIframeRef}
                style={{ display: 'none' }}
                title="Print PDF"
            />
           <Modal
    title={formCat.getFieldValue("id") == null ? "សេចក្តីប្រកាស | បន្ថែមថ្មី" : "សេចក្តីប្រកាស | កែប្រែ"}
    visible={open}
    onCancel={onCloseModule}
    footer={null}
    width="50%"
    maskClosable={false}
>

                <Form form={formCat} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="ចំណង់ជើង"
                                name="title"
                                rules={[{ required: true, message: "សូមបំពេញចំណង់ជើង!" }]}
                            >
                                <Input placeholder="ចំណង់ជើង" />
                            </Form.Item>
                        </Col>
                       
                    </Row>
                    <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="មាតិកា"
                                    name={"description"}
                                    rules={[
                                        {
                                            required: true,
                                            message: "សូមបំពេញមាតិកា!",
                                        }
                                    ]}
                                >
                                    <TextArea style={{ width: "100%" }} placeholder="មាតិកា" rows={4} />
                                </Form.Item>
                            </Col>
                     </Row>
              
                    <Form.Item label="Upload PDF File">
                        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                            {!isEmptyOrNull(filePreview) && (
                                <CloseOutlined
                                    onClick={onRemoveFileSelected}
                                    style={{ color: "red", fontSize: 18, position: 'absolute', top: -6, right: -6, backgroundColor: "#EEE", padding: 3 }}
                                />
                            )}
                            {!isEmptyOrNull(filePreview) ? (
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                    <div style={{ height: 300, overflow: 'auto' }}>
                                        <Viewer fileUrl={filePreview} onDocumentLoadSuccess={(pdf) => setFirstPageNumber(1)} />
                                    </div>
                                </Worker>
                            ) : (
                                <div style={{ width: 70, height: 70, backgroundColor: '#EEE' }}></div>
                            )}
                        </div>
                        <Input onChange={handleFileSelect} ref={fileRef} type="file" id="selectedFile" style={{ display: "none" }} />
                        <Button
                            icon={<UploadOutlined />}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('selectedFile').click();
                            }}
                            style={{ marginTop: 10, marginLeft: 3, width: "50%" }}
                        >
                            Browse...
                        </Button>
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModule}>បដិសេធ</Button>
                            <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                visible={viewPDF}
                onCancel={onCloseViewPDF}
                footer={null}
                width={800}
                bodyStyle={{ height: '80vh' }}
            >
                <iframe src={fileUrl} style={{ width: '100%', height: '100%' }} />
            </Modal>
            {/* {selectedItem && (
                <Modal
                    title="ព័ត៌មានលម្អិត"
                    open={detailOpen}
                    onCancel={() => setDetailOpen(false)}
                    footer={null}
                    width="50%"
                    maskClosable={false}
                >
                    <p><strong>ចំណងជើង:</strong> {selectedItem.title}</p>
                    <p><strong>មាតិកា:</strong> {selectedItem.description}</p>
                    <p><strong>ថ្ងៃបង្កើត:</strong> {formatKhmerDate(selectedItem.createdAt)}</p>
                    {selectedItem.file_path && (
                        <div>
                            <strong>ឯកសារ:</strong>
                            <div style={{ marginTop: 10 }}>
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                    <div style={{ height: 300, overflow: 'auto' }}>
                                        <Viewer fileUrl={Config.image_path + selectedItem.file_path} />
                                    </div>
                                </Worker>
                            </div>
                        </div>
                    )}
                </Modal>
            )} */}
        </MainPage>
    );
};

export default BooksPage;
