import React, { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Col, Row, Image, Spin, Upload } from "antd";
import { UploadOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/km';
import MainPage from "../component/page/MainPage";
import 'react-quill/dist/quill.snow.css';
import "../component/assets/css/TextEditor.css";
import { Config, isEmptyOrNull, formatDateClient } from "../config/helper";
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';

var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

const { TextArea } = Input;

const ValuePage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [viewItem, setViewItem] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [formCat] = Form.useForm();
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [imageDefault, setImageDefault] = useState([]);
    const [imageOptional, setImageOptional] = useState([]);
    const quillRef = useRef();

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'video', 'formula'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

    const modules = {
        toolbar: toolbarOptions,
    };

    useEffect(() => {
        getList();
    }, []);

    const filterRef = useRef({
        txt_search: null,
    });

    const paragraphStyle = {
        textAlign: "justify",
        textJustify: "inter-word",
        padding: '8px',
    };

    const getList = async () => {
        setLoading(true);
        const param = {
            txt_search: filterRef.current.txt_search,
        };
        try {
            const res = await request("values/getList", "get", param);
            if (res) {
                setList(res.list);
            }
        } catch (error) {
            message.error("Failed to fetch the list");
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChangeImageDefault = ({ fileList }) => {
        setImageDefault(fileList);
    };

    const clearCachesAndRefresh = async () => {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }
        setRefreshLoading(true);
        setTimeout(() => {
            getList();
            setRefreshLoading(false);
        }, 1000);
    };

    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const filePreview = URL.createObjectURL(file);
            setFileSelected(file);
            setFilePreview(filePreview);
        }
    };

    const onClickBtnEdit = (item) => {
        setIsEditMode(true);
        formCat.setFieldsValue({
            ...item
        });

        setOpen(true);
        
        if (item.image !== "" && item.image !== null) {
            const imageTrain = [
                {
                    uid: "-1",
                    name: item.image,
                    status: "done",
                    url: Config.image_path + item.image,
                }
            ];
            setImageDefault(imageTrain);
        }
    };

    const fileRef = useRef(null);
    const onRemoveFileSelected = () => {
        fileRef.current.value = null;
        setFilePreview(null);
        setFileSelected(null);
    };

    const onCloseModule = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            Status: "1"
        });
        setOpen(false);
        setImageDefault([]);
        setIsEditMode(false);
    };

    const onClickBtnDelete = (item) => {
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
                    const res = await request("values/delete", "delete", data);
                    if (res) {
                        message.success(res.message);
                        getList();
                    }
                } catch (error) {
                    message.error("ការលុបរបស់លោកអ្នកមិនទទួលបានជោគជ័យទេ!");
                }
            }
        });
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

    const onFinish = async (item) => {
        setModalLoading(true);
        var form = new FormData();
        form.append("Title", item.Title);
        form.append("Description", item.Description);
        form.append("image", formCat.getFieldValue("image"));

        if (imageOptional && imageOptional.length > 0) {
            imageOptional.map((item) => {
                form.append("image_optional", item);
            });
        }

        form.append("id", formCat.getFieldValue("id"));
        if (item.image_default) {
            if (item.image_default.file.status === "removed") {
                form.append("image_remove", "1");
            } else {
                form.append(
                    "upload_image",
                    item.image_default.file.originFileObj,
                    item.image_default.file.name
                );
            }
        }

        var method = "post";
        if (formCat.getFieldValue("id")) {
            method = "put";
        }
        var url = "values/create";
        if (formCat.getFieldValue("id")) {
            url = "values/update";
        }

        try {
            const res = await request(url, method, form);
            if (res) {
                if (res.error) {
                    var mgs = "";
                    Object.keys(res.message).map((key, index) => {
                        mgs += res.message[key];
                    });
                    message.error(mgs);
                    setModalLoading(false);
                    return false;
                }
                message.success(res.message);
                await getList();
                onCloseModule();
                clearCachesAndRefresh();
            }
        } catch (error) {
            message.error("ការរក្សាទុករបស់លោកអ្នកមិនទទួលបានជោគជ័យទេ!");
        } finally {
            setModalLoading(false);
        }
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const openNewModal = () => {
        formCat.resetFields();
        setFilePreview(null);
        setFileSelected(null);
        setIsEditMode(false);
        setOpen(true);
    };

    const handleView = (item) => {
        setViewItem(item);
        setIsViewModalOpen(true);
    };

    const handleViewModalClose = () => {
        setIsViewModalOpen(false);
        setViewItem(null);
    };

    const columns = [
        {
            key: "No",
            title: "ល.រ",
            align: 'left',
            width: 60,
            render: (value, item, index) => (index + 1)
        },
        {
            key: "title",
            title: "ចំណង់ជើង",
            dataIndex: "Title",
        },
        {
            key: "Image",
            title: "រូបភាព",
            dataIndex: "image",
            render: (value) => {
                if (value != null && value != "") {
                    return (
                        <Image src={Config.image_path + value} alt="" width={60} />
                    );
                } else {
                    return (
                        <div style={{ height: 30, width: 25, backgroundColor: "#888" }} />
                    );
                }
            }
        },
        {
            key: "CreateAt",
            title: "ថ្ងៃបង្កើត",
            dataIndex: "CreateAt",
            render: (value) => formatKhmerDate(value)
        },
        {
            key: "Actions",
            title: "សកម្មភាព",
            render: (value, item) => (
                <Space>
                    <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                    <Button onClick={() => handleView(item)}>មើល</Button>
                    <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                </Space>
            )
        }
    ];

    return (
        <MainPage loading={loading}>
            {refreshLoading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', 
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 9999
                }}>
                    <Spin size="large" />
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">គុណតម្លៃ</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" />
                </Space>
                <Space>
                    <Button icon={<PlusOutlined />} type="primary" onClick={openNewModal}>
                        បន្ថែម
                    </Button>
                </Space>
            </div>
            <hr />
            <Spin spinning={loading}>
                <Table
                    dataSource={list}
                    pagination={{ pageSize: 7 }}
                    rowKey="id"
                    width={100}
                    columns={columns}
                />
            </Spin>
            <Modal
                title={isEditMode ? "កែប្រែ | គុណតម្លៃ" : "បន្ថែម | គុណតម្លៃ"}
                open={open}
                maskClosable={false}
                onCancel={onCloseModule}
                okText="Save"
                footer={null}
                width="100%"
            >
                <Spin spinning={modalLoading}>
                    <Form
                        form={formCat}
                        layout="vertical"
                        onFinish={onFinish}
                    >

                        <Row>
                            <Col span={24}>
  <Form.Item
    label={<span style={{ fontFamily: "'Khmer OS', 'Khmer OS System', 'Khmer OS Content', sans-serif" }}>ចំណង់ជើង</span>}
    name={"Title"}
    rules={[
      {
        required: true,
        message: <span style={{ fontFamily: "'Khmer OS', 'Khmer OS System', 'Khmer OS Content', sans-serif" }}>សូមបំពេញចំណង់ជើង!</span>,
      }
    ]}
  >
    <Input 
      style={{ 
        width: "100%",
        fontFamily: "'Khmer OS Siem Reap', sans-serif",
        fontSize: "14px"
      }} 
      placeholder="ចំណង់ជើង" 
    />
  </Form.Item>
</Col>
                            {/* <Col span={24}>
                                <Form.Item
                                    label="ចំណង់ជើង"
                                    name={"Title"}
                                    rules={[
                                        {
                                            required: true,
                                            message: "សូមបំពេញចំណង់ជើង!",
                                        }
                                    ]}
                                >
                                    <Input style={{ width: "100%" }} placeholder="ចំណង់ជើង" />
                                </Form.Item>
                            </Col> */}
                        </Row>
                        <Form.Item name={"image_default"} label="Cover រូបភាព (Upload បានត្រឹមចំនួន ១​សន្លឹក )">
                            <Upload
                                customRequest={(options) => {
                                    options.onSuccess();
                                }}
                                multiple={true}
                                maxCount={1}
                                listType="picture-card"
                                fileList={imageDefault}
                                onPreview={handlePreview}
                                onChange={handleChangeImageDefault}
                            >
                                <div>+ Upload</div>
                            </Upload>
                        </Form.Item>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="មាតិកា"
                                    name="Description"
                                    rules={[
                                        {
                                            required: true,
                                            message: "សូមបំពេញមាតិកា!",
                                        },
                                    ]}
                                >
                                    <ReactQuill
                                        modules={modules}
                                        theme="snow"
                                        value={formCat.getFieldValue("Description") || ""}
                                        onChange={(value) => {
                                            formCat.setFieldsValue({ Description: value });
                                        }}
                                        style={{ height: 500 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <br/>
                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: visible => setPreviewOpen(visible),
                                    afterOpenChange: visible => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}

                        <Form.Item style={{ textAlign: "Right" }}>
                            <Space>
                                <Button onClick={onCloseModule}>Cancel</Button>
                                <Button type="primary" htmlType="submit">
                                    {formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
            <Modal
                open={isViewModalOpen}
                onCancel={handleViewModalClose}
                footer={[
                    <Button key="close" onClick={handleViewModalClose}>
                        បិទវិញ
                    </Button>
                ]}
                width={800}
            >
                {viewItem && (
                    <div style={paragraphStyle}>
                        <p><strong>ចំណង់ជើង:</strong> {viewItem.Title}</p>
                        <p>
                            <strong>មាតិកា:</strong>{" "}
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(viewItem.Description) }} />
                        </p>
                        {viewItem.image && (
                            <Image 
                                src={Config.image_path + viewItem.image} 
                                alt="" 
                                width={200} 
                                style={{ margin: '10px 0' }}
                            />
                        )}
                        <p><strong>ថ្ងៃបង្កើត:</strong> {formatKhmerDate(viewItem.CreateAt)}</p>
                    </div>
                )}
            </Modal>
        </MainPage>
    );
};

export default ValuePage;