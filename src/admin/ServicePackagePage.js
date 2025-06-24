import React, { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Col, Row, Image, Spin } from "antd";
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/km'; // Ensure the custom locale is imported
import MainPage from "../component/page/MainPage";
import "../component/assets/css/TextEditor.css";
import { Config, isEmptyOrNull, formatDateClient } from "../config/helper";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;


const LeaderPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [viewItem, setViewItem] = useState(null); // New state for viewing an item
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // New state for view modal
    const [formCat] = Form.useForm();
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [content, setContent] = useState('');

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

    const handleContentChange = (value) => setContent(value);
      
    const getList = async () => {
        setLoading(true);
        const param = {
            txt_search: filterRef.current.txt_search,
        };
        try {
            const res = await request("servicePackage/getList", "get", param);
            if (res) {
                setList(res.list);
            }
        } catch (error) {
            message.error("Failed to fetch the list");
        } finally {
            setLoading(false);
        }
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
        }, 1000); // Set delay for better UX
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
            ...item,
            "image": item.Image
        });
        setFilePreview(Config.image_path + item.Image);
        setOpen(true);
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
                    const res = await request("servicePackage/delete", "delete", data);
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

    // Function to convert Arabic numerals to Khmer numerals
    const toKhmerNumeral = (num) => {
        const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        return num.toString().split('').map(digit => khmerNumerals[digit]).join('');
    };

    // Function to format date to Khmer format
    const formatKhmerDate = (date) => {
        const day = toKhmerNumeral(dayjs(date).date());
        const month = dayjs(date).locale('km').format('MMMM');
        const year = toKhmerNumeral(dayjs(date).year());
        return `ថ្ងៃទី${day} ខែ${month} ${year}`;
    };

    const onFinish = async (item) => {
        setModalLoading(true); // Start modal loading
        var id = formCat.getFieldValue("id");
        var form = new FormData();
        form.append("id", id);
        form.append("Title", item.Title);
        form.append("Description", item.Description);

        form.append("PreImage", formCat.getFieldValue("image"));
        if (fileSelected != null) {
            form.append("image", fileSelected);
        }
        var method = (id == null ? "post" : "put");
        const url = (id == null ? "servicePackage/create" : "servicePackage/update");
        try {
            const res = await request(url, method, form);
            if (res) {
                if (res.error) {
                    var mgs = "";
                    Object.keys(res.message).map((key, index) => {
                        mgs += res.message[key];
                    });
                    message.error(mgs);
                    setModalLoading(false); // End modal loading on error
                    return false;
                }
                message.success(res.message);
                await getList();  // Reload the list
                onCloseModule();  // Close the modal
                clearCachesAndRefresh(); // Clear caches and refresh
                 window.location.reload();  // Refresh the page
            }
        } catch (error) {
            message.error("ការរក្សាទុករបស់លោកអ្នកមិនទទួលបានជោគជ័យទេ!");
        } finally {
            setModalLoading(false); // End modal loading
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
            key: "description",
            title: "មាតិកា",
            dataIndex: "Description",
            render: (value) => {
                if (typeof value === 'string') {
                    return <span dangerouslySetInnerHTML={{ __html: value }} />;
                }
            }
        },
   
        {
            key: "Image",
            title: "រូបភាព",
            dataIndex: "Image",
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
                    display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 9999
                }}>
                    <Spin size="large" />
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">កញ្ចប់សេវា</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" />
                </Space>
                <Space>
                    <Button onClick={openNewModal} type="primary">បន្ថែមថ្មី</Button>
                </Space>
            </div>
            <hr />
            <Spin spinning={loading}>
                <Table
                    dataSource={list}
                    pagination={{ pageSize: 7 }}
                    rowKey="id"
                    columns={columns}
                />
            </Spin>
            <Modal
                title={isEditMode ? "កែប្រែ | កញ្ចប់សេវា" : "បន្ថែម | កញ្ចប់សេវា"}
                open={open}
                maskClosable={false}
                onCancel={onCloseModule}
                okText="Save"
                footer={null}
                width="100%"
                height="100%"
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
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>

                            <Form.Item
                                label="មាតិកា"
                                name="Description"
                                rules={[{ required: true, message: "Please input Content!" }]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    placeholder="មាតិកា"
                                    value={content}
                                    onChange={handleContentChange}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                            [{ size: [] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                            ['link'],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </Form.Item>
                                {/* <Form.Item
                                    label="មាតិកា"
                                    name={"Description"}
                                    rules={[
                                        {
                                            required: true,
                                            message: "សូមបំពេញមាតិកា!",
                                        }
                                    ]}
                                >
                                    <TextArea style={{ width: "100%" }} placeholder="មាតិកា" rows={4} />
                                </Form.Item> */}
                            </Col>
                        </Row>
                        <Form.Item
                            label="Upload រូបភាព"
                        >
                            <>
                                <div style={{ width: "90%", position: 'relative' }}>
                                    {!isEmptyOrNull(filePreview) &&
                                        <CloseOutlined
                                            onClick={onRemoveFileSelected}
                                            style={{ color: "red", fontSize: 18, position: 'absolute', top: -6, right: -6, backgroundColor: "#EEE", padding: 3 }} />
                                    }
                                    {!isEmptyOrNull(filePreview) ?
                                        <img
                                            src={filePreview}
                                            style={{ width: "90%" }}
                                            alt=""
                                        />
                                        :
                                        <div style={{ width: 70, height: 70, backgroundColor: '#EEE' }}></div>
                                    }
                                </div>
                                <input onChange={handleChangeFile} ref={fileRef} type="file" id="selectedFile" style={{ display: "none" }} />
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
                            </>
                        </Form.Item>
                        <Form.Item style={{ textAlign: "Right" }}>
                            <Space>
                                <Button onClick={onCloseModule}>Cancel</Button>
                                <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
            <Modal
                // title="ប្រវត្តិមន្ទីរពេទ្យ"
                open={isViewModalOpen}
                onCancel={handleViewModalClose}
                footer={[
                    <Button key="close" onClick={handleViewModalClose}>
                        បិទវិញ
                    </Button>
                ]}
            >
                {viewItem && (
                    <div style={paragraphStyle}>
                        <p><strong>ចំណង់ជើង:</strong> {viewItem.Title}</p>
                        <p><strong>មាតិកា:</strong></p>
                        <div dangerouslySetInnerHTML={{ __html: viewItem.Description }} />
                        {viewItem.Image && (
                            <Image src={Config.image_path + viewItem.Image} alt="" width={200} />
                        )}
                        <p><strong>ថ្ងៃបង្កើត:</strong> {formatKhmerDate(viewItem.CreateAt)}</p>
                    </div>
                )}
            </Modal>
        </MainPage>
    );
};

// export default HistoryPage;


export default LeaderPage;
