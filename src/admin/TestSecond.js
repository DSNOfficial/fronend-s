import { useEffect, useState, useRef, useCallback } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Image, Row, Col } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from "dayjs";
import MainPage from "../component/page/MainPage";
import { Config, isEmptyOrNull } from "../config/helper";

const PostForm = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [formCat] = Form.useForm();
    const [content, setContent] = useState('');
    const [fileSelected, setFileSelected] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const filterRef = useRef({ txt_search: null });
    const fileRef = useRef(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const param = { txt_search: filterRef.current.txt_search };
            const res = await request("posts/getList", "get", param);
            if (res && res.list) {
                setPosts(res.list);
            } else {
                message.error("Failed to fetch posts");
            }
        } catch (error) {
            console.error('fetchPosts error:', error);
            message.error("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        formCat.setFieldsValue({ status: "1" });
        fetchPosts();
    }, [fetchPosts]);

    const handleContentChange = (value) => setContent(value);

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({ ...item, image: item.Image });
        setContent(item.content || '');
        setFilePreviews(item.photos ? item.photos.split(',').map(photo => Config.image_path + photo) : []);
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
                try {
                    const res = await request("posts/delete", "delete", { id: item.id });
                    if (res) {
                        message.success(res.message);
                        fetchPosts();
                    } else {
                        message.error("Failed to delete the post");
                    }
                } catch (error) {
                    console.error('delete post error:', error);
                    message.error("Failed to delete the post");
                }
            },
        });
    };

    const onFinish = async (item) => {
        const id = formCat.getFieldValue("id");
        const form = new FormData();
        form.append("id", id);
        form.append("title", item.title);
        form.append("content", content);
        form.append("status", item.status);
        form.append("preImage", formCat.getFieldValue("image"));
        fileSelected.forEach(file => form.append("photos", file));
        const method = id == null ? "post" : "put";
        const url = id == null ? "posts/create" : "posts/update";
        try {
            const res = await request(url, method, form);
            if (res.error) {
                const errorMsg = Object.values(res.message).join(' ');
                message.error(errorMsg);
            } else {
                message.success(res.message);
                fetchPosts();
                onCloseModal();
            }
        } catch (error) {
            console.error('submit post error:', error);
            message.error("Failed to save the post");
        }
    };

    const handleSearch = () => fetchPosts();

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value.trim();
    };

    const onCloseModal = () => {
        formCat.resetFields();
        formCat.setFieldsValue({ status: "1" });
        setContent('');
        setFileSelected([]);
        setFilePreviews([]);
        setOpen(false);
    };

    const onChangeFile = (e) => {
        const files = Array.from(e.target.files);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setFileSelected(files);
        setFilePreviews(filePreviews);
    };

    const onRemoveFileSelected = (index) => {
        if (index != null) {
            const newFileSelected = [...fileSelected];
            const newFilePreviews = [...filePreviews];
            newFileSelected.splice(index, 1);
            newFilePreviews.splice(index, 1);
            setFileSelected(newFileSelected);
            setFilePreviews(newFilePreviews);
        } else {
            fileRef.current.value = null;
            setFileSelected([]);
            setFilePreviews([]);
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

    

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">ការផ្សព្វផ្សាយព័ត៌មាន</div>
                    <Input.Search allowClear onChange={onChangeSearch} onSearch={handleSearch} placeholder="ស្វែងរក" />
                </Space>
                <Button onClick={() => setOpen(true)} type="primary">បន្ថែមថ្មី</Button>
            </div>
            <Table
                dataSource={posts}
                pagination={{ pageSize: 5 }}
                columns={[
                    {
                        key: "No",
                        title: "ល.រ",
                        dataIndex: "name",
                        align: 'left',
                        width:60,
                        
                        render: (value, item, index) => index + 1,
                    },
                    {
                        key: "title",
                        title: "ចំណង់ជើង",
                        dataIndex: "title",
                    },
                 ,
                    {
                        key: "content",
                        title: "មាតិកា",
                        dataIndex: "content",
                        ellipsis: true,
                        render: (value) => value && <span dangerouslySetInnerHTML={{ __html: value }} />,
                    },
                    {
                        key: "photos",
                        title: "រូបភាព",
                        dataIndex: "photos",
                        render: (photos) => (
                            photos ? (
                                photos.split(',').map((photo, index) => (
                                    <Image key={index} src={Config.image_path + photo} width={60} style={{ marginRight: 5 }} />
                                ))
                            ) : (
                                <div style={{ width: 60, height: 40, backgroundColor: '#888' }}></div>
                            )
                        ),
                    },
                    {
                        key: "createAt",
                        title: "ថ្ងៃបង្កើត",
                        dataIndex: "createAt",
                        render: (value) => formatKhmerDate(value)
                    },
                    {
                        key: "Action",
                        title: "កែប្រែ​/លុប",
                        dataIndex: "status",
                        render: (value, item) => (
                            <Space>
                                <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                            </Space>
                        ),
                    },
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "ការផ្សព្វផ្សាយព័ត៌មាន | បន្ថែមថ្មី" : "ការផ្សព្វផ្សាយព័ត៌មាន | កែប្រែ"}
                visible={open}
                onCancel={onCloseModal}
                footer={null}
                maskClosable={false}
                width="100%"
                height="100%"
            >
                <Form form={formCat} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="ចំណង់ជើង"
                                name="title"
                                rules={[{ required: true, message: 'សូមបំពេញចំណង់ជើង!' }]}
                            >
                                <Input placeholder="ចំណង់ជើង" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="មាតិកា"
                                name="content"
                                rules={[{ required: true, message: 'សូមបំពេញមាតិកា!' }]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    placeholder="សរសេរមាតិកា"
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
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Upload រូបភាព">
                                <>
                                    <div style={{ width: "20%", position: 'relative' }}>
                                        {filePreviews.map((preview, index) => (
                                            <div key={index} style={{ display: 'inline-block', marginRight: 10 }}>
                                                <CloseOutlined
                                                    onClick={() => onRemoveFileSelected(index)}
                                                    style={{ color: "red", fontSize: 18, position: 'absolute', top: -6, right: -6, backgroundColor: "#EEE", padding: 3 }}
                                                />
                                                <img src={preview} alt="" style={{ width: "90%" }} />
                                            </div>
                                        ))}
                                        {!isEmptyOrNull(filePreviews) ? null : <div style={{ width: 70, height: 70, backgroundColor: '#EEE' }}></div>}
                                    </div>
                                    <input onChange={onChangeFile} ref={fileRef} type="file" multiple style={{ display: "none" }} />
                                    <Button
                                        icon={<UploadOutlined />}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fileRef.current.click();
                                        }}
                                        style={{ marginTop: 10, marginLeft: 3, width: "50%" }}
                                    >
                                        ស្វែងរករូបភាព...
                                    </Button>
                                </>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16} justify="end">
                        <Col>
                            <Space>
                                <Button onClick={onCloseModal}>បដិសេធ</Button>
                                <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </MainPage>
    );
};

export default PostForm;
