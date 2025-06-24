import React, { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Col, Row, Image, Spin } from "antd";
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import MainPage from "../component/page/MainPage";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import "../component/assets/css/TextEditor.css";
import dayjs from "dayjs";
import { Config, isEmptyOrNull, formatDateClient } from "../config/helper";

const { TextArea } = Input;

const SlideShowPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [formCat] = Form.useForm();
    const [count, setCount] = useState(0);
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showImages, setShowImages] = useState(true);
    const [viewItem, setViewItem] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    useEffect(() => {
        formCat.setFieldsValue({
            status: "1"
        });
        getList();
    }, []);

    const filterRef = useRef({
        txt_search: null,
        status: null
    });

    const getList = async () => {
        setLoading(true);
        const param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
        };
        try {
            const res = await request("showImage/getList", "get", param);
            if (res) {
                setList(res.list);
                setCount(res.list.length);
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
                    const res = await request("showImage/delete", "delete", data);
                    if (res) {
                        message.success(res.message);
                        getList();
                    }
                } catch (error) {
                    message.error("Failed to delete the item");
                }
            }
        });
    };

    const onFinish = async (item) => {
        setModalLoading(true);
        var id = formCat.getFieldValue("id");
        var form = new FormData();
        form.append("id", id);
        form.append("title", item.title);
        form.append("PreImage", formCat.getFieldValue("image"));
        if (fileSelected != null) {
            form.append("image", fileSelected);
        }
        var method = (id == null ? "post" : "put");
        const url = (id == null ? "showImage/create" : "showImage/update");
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
                window.location.reload();
            }
        } catch (error) {
            message.error("Failed to save the item");
        } finally {
            setModalLoading(false);
        }
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const onChangeStatus = (value) => {
        filterRef.current.status = value;
        getList();
    };

    const onCloseModal = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            status: "1"
        });
        setOpen(false);
    };

    const openNewModal = () => {
        formCat.resetFields();
        setFilePreview(null);
        setFileSelected(null);
        setIsEditMode(false);
        setOpen(true);
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

    const onClickBtnView = (item) => {
        setViewItem(item);
        setViewModalOpen(true);
    };

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
                    <div className="txt_title">ជា​រូបភាព Show</div>
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
                    columns={[
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
                            dataIndex: "title",
                            ellipsis: true,
                            width: 300,
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
                            dataIndex: "createdAt",
                            render: (value) => formatKhmerDate(value)
                        },
                        {
                            key: "Action",
                            title: "កែប្រែ/លុប/មើល",
                            width: 300,

                            render: (value, item) => (
                                <Space>
                                       <Button onClick={() => onClickBtnView(item)}>មើល</Button>
                                    <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                    <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                                 
                                </Space>
                            )
                        }
                    ]}
                />
            </Spin>
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "ជា​រូបភាព Show | បន្ថែមថ្មី" : "ជា​រូបភាព Show | បន្ថែមថ្មី"}
                open={open}
                maskClosable={false}
                onCancel={onCloseModule}
                okText="Save"
                footer={null}
                width="50%"
                height="50%"
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
                                    name={"title"}
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
                                <Button onClick={onCloseModule}>បដិសេធ</Button>
                                <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
            <Modal
                title="មើលព័ត៌មាន"
                visible={viewModalOpen}
                onCancel={() => setViewModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setViewModalOpen(false)}>
                        បិទ
                    </Button>
                ]}
            >
                {viewItem && (
                    <div>
                        <p><strong>ចំណង់ជើង:</strong> {viewItem.title}</p>
                        <p><strong>រូបភាព:</strong></p>
                        <img src={Config.image_path + viewItem.Image} alt="" style={{ width: "100%" }} />
                        <p><strong>ថ្ងៃបង្កើត:</strong> {formatKhmerDate(viewItem.createdAt)}</p>
                    </div>
                )}
            </Modal>
        </MainPage>
    );
}

export default SlideShowPage;
