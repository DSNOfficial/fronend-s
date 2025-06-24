import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, Image, Row, Col } from "antd";
import { Config, isEmptyOrNull } from "../config/helper";
import MainPage from "../component/page/MainPage";
import dayjs from 'dayjs';
import 'dayjs/locale/km'; // Ensure the custom locale is imported
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdministrationPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [formCat] = Form.useForm();
    const [fileSelected, setFileSelected] = useState(null); // past to api
    const [filePreview, setFilePreview] = useState(null); // preview in client

    useEffect(() => {
        formCat.setFieldsValue({
            Status: "1"
        });
        getList();
    }, []);

    const filterRef = useRef({
        txt_search: null,
        status: null,
        role_id: null
    });

    const fileRef = useRef(null);

    const getList = async () => {
        setLoading(true);
        const param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
            role_id: filterRef.current.role_id,
        };
        const res = await request("administration/getList", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
        }
    };

    const handleContentChange = (value) => setContent(value);

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({
            ...item,
            "image": item.Image
        });
        setFilePreview(Config.image_path + item.Image);
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
                const res = await request("administration/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            }
        });
    };

    const onFinish = async (item) => {
        const id = formCat.getFieldValue("id");
        const form = new FormData();

        form.append("id", id);
        form.append("title", item.title);
        form.append("description", item.description);
        form.append("code", item.code || generateUniqueCode());
        form.append("PreImage", formCat.getFieldValue("image"));

        if (fileSelected != null) {
            form.append("image", fileSelected);
        }

        const method = (id == null ? "post" : "put");
        const url = (id == null ? "administration/create" : "administration/update");
        const res = await request(url, method, form);

        if (res) {
            if (res.error) {
                let mgs = "";
                Object.keys(res.message).forEach(key => {
                    mgs += res.message[key];
                });
                message.error(mgs);
                return false;
            }
            message.success(res.message);
            getList();
            onCloseModal();
            // window.location.reload();  // Refresh the page
        }
    };

    const onTextSearch = (value) => { };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const onChangeStatus = (value) => {
        filterRef.current.value = value;
        getList();
    };

    const onCloseModal = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            Status: "1"
        });
        setOpen(false);
        onRemoveFileSelected();
    };

    const onSelectRole = (value) => {
        filterRef.current.role_id = value;
        getList();
    };

    const onChnageFile = (e) => {
        const file = e.target.files[0];
        const filePreview = URL.createObjectURL(file);
        setFileSelected(file);
        setFilePreview(filePreview);
    };

    const onRemoveFileSelected = () => {
        fileRef.current.value = null;
        setFileSelected(null);
        setFilePreview(null);
    };

    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const filePreview = URL.createObjectURL(file);
            setFileSelected(file);
            setFilePreview(filePreview);
        }
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

    const generateUniqueCode = () => {
        const currentYear = new Date().getFullYear();
        const lastItem = list.length ? list[list.length - 1] : null;
        let nextCode = 1;

        if (lastItem) {
            const lastYear = parseInt(lastItem.code.split('-')[2]);
            if (lastYear === currentYear) {
                nextCode = parseInt(lastItem.code.split('-')[1]) + 1;
            }
        }

        return `TSNH-${String(nextCode).padStart(3, '0')}-${currentYear}`;
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">រដ្ឋបាល</div>

                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                </Space>

                <Button
                    onClick={() => {
                        formCat.setFieldsValue({
                            id: null,
                            code: generateUniqueCode(),
                            title: '',
                            description: '',
                            image: null,
                        });
                        setFilePreview(null);
                        setOpen(true);
                    }}
                    type="primary"
                >
                    បន្ថែមថ្មី
                </Button>
            </div>
            <Table
                dataSource={list}
                pagination={{
                    pageSize: 5,
                }}
                columns={[
                    // {
                    //     key: "No",
                    //     title: "ល.រ",
                    //     dataIndex: "Name",
                    //     render: (value, item, index) => (index + 1)
                    // },
                    {
                        key: "code",
                        title: "ល.រ",
                        dataIndex: "code",
                    },
                    {
                        key: "title",
                        title: "ចំណង់ជើង",
                        dataIndex: "title",
                        ellipsis: true,
                        width: 120,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        webkitLineClamp: 3,
                    },

                    {
                        key: "description",
                        title: "មាតិកា",
                        dataIndex: "description",
                        ellipsis: true,
                        width: 300,
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
                        render: (image) => {
                            if (isEmptyOrNull(image)) {
                                return <div style={{ width: 50, height: 50, backgroundColor: "#EEE" }}></div>;
                            }
                            return (
                                <Image
                                    src={Config.image_path + image}
                                    style={{ width: 50, height: 50 }}
                                />
                            );
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
                        title: "កែប្រែ/លុប",
                        dataIndex: "Status",
                        align: 'right',
                        width: 120,
                        render: (value, item, index) => (
                            <Space>
                                <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                            </Space>
                        )
                    }
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "រដ្ឋបាល | បន្ថែមថ្មី" : "រដ្ឋបាល | កែប្រែ"}
                open={open}
                onCancel={onCloseModal}
                footer={null}
                maskClosable={false}
                width="100%"
                height="100%"

            >
                <Form
                    form={formCat}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="ចំណងជើង"
                                name={"title"}
                                rules={[
                                    { required: true, message: 'សូមបំពេញចំណងជើង!' },
                                ]}
                            >
                                <Input placeholder="ចំណងជើង" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row >
                        <Col span={12}>
                            <Form.Item
                                label="Upload រូបភាព"
                            >
                                <>
                                    <div style={{ width: "90%", position: 'relative' }}>
                                        {!isEmptyOrNull(filePreview) &&
                                            <CloseOutlined
                                                onClick={onRemoveFileSelected}
                                                style={{ color: "red", fontSize: 18, position: 'absolute', top: -6, right: -6, backgroundColor: "#EEE", padding: 3 }} />}
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
                                        ស្វែងរក...
                                    </Button>
                                </>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row >
                        <Col span={24}>
                            <Form.Item
                                label="មាតិកា"
                                name="description"
                                rules={[{ required: true, message: "Please input Content!" }]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    style={{ height: 500 }}
                                    onChange={(value) => formCat.setFieldsValue({ content: value })}
                                    value={formCat.getFieldValue("description")}
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
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModal}>បដិសេធ</Button>
                            <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </MainPage>
    );
};

export default AdministrationPage;
