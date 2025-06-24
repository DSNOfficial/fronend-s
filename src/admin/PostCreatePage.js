import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePostAdd } from "react-icons/md";
import { request } from "../config/request";
import {
    Table, Button, Space, Modal, Input, Form, Select, message, Row, Col
} from "antd";
import MainPage from "../component/page/MainPage";
import { Config, isEmptyOrNull } from "../config/helper";
import { ArrowLeftOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IoIosRefresh } from "react-icons/io";
import "../component/assets/css/TextEditor.css";

const PostPage = () => {
    const [fileSelected, setFileSelected] = useState(null);
    const [multiFiles, setMultiFiles] = useState([]);
    const [category, setCategory] = useState([]);
    const [user, setUser] = useState([]);
    const [filePreview, setFilePreview] = useState(null);
    const [multiFilePreviews, setMultiFilePreviews] = useState([]);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');

    const fileRef = useRef(null);
    const multiFileRef = useRef(null);
    const filterRef = useRef({ txt_search: null, status: null });
    const [formCat] = Form.useForm();
    const navigate = useNavigate();

    const fetchList = async () => {
        setLoading(true);
        const param = { txt_search: filterRef.current.txt_search, status: filterRef.current.status };
        const res = await request("tbpost/getlist", "get", param);
        setLoading(false);
        if (res) {
            console.log('API Response:', res);
            setList(res.list || []);
            setCategory(res.category || []);
            setUser(res.user || []);
        }
    };

    useEffect(() => {
        formCat.setFieldsValue({ Status: "1" });
        fetchList();
    }, []);

    const handleContentChange = (value) => setContent(value);

    const handleEdit = (item) => {
        formCat.setFieldsValue({ ...item, "Image": item.image });
        setFilePreview(Config.image_path + item.image);
        setOpen(true);
    };

    const handleDelete = async (item) => {
        Modal.confirm({
            title: "Delete",
            content: "Are you sure you want to delete?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                const data = { id: item.id, parentId: item.parentId };
                const res = await request("tbpost/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    fetchList();
                }
            }
        });
    };

    const handleSubmit = async (item) => {
        Modal.confirm({
            title: "Post",
            content: "Are you sure you want to post this news?",
            okText: "Yes",
            cancelText: "No",
            okType: "primary",
            centered: true,
            onOk: async () => {
                const id = formCat.getFieldValue("id");
                const form = new FormData();
                form.append("id", id);
                form.append("departmentId", item.departmentId);
                form.append("userId", item.userId);
                form.append("title", item.title);
                form.append("content", item.content);
                form.append("summary", item.summary);

                form.append("PreImage", formCat.getFieldValue("Image"));
                if (fileSelected != null) {
                    form.append("image", fileSelected);
                }
                var method = (id == null ? "post" : "put")
                var url = (id == null ? "tbpost/create" : "tbpost/update")
                const res = await request(url, method, form);
                if (res) {
                    message.success(res.message)
                    fetchList();
                    clearForm();
                    // window.location.reload();  // Refresh the page
                }
            }
        });
    };

    const clearForm = () => {
        formCat.resetFields();
        setContent('');
        setFilePreview(null);
        setFileSelected(null);
        setMultiFiles([]);
        setMultiFilePreviews([]);
    };

    const handleSearch = (value) => {
        filterRef.current.txt_search = value;
        fetchList();
    };

    const handleStatusChange = (value) => {
        filterRef.current.status = value;
        fetchList();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileSelected(file);
        setFilePreview(URL.createObjectURL(file));
    };

    const handleMultiFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setMultiFiles(files);
        setMultiFilePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleFileRemove = () => {
        fileRef.current.value = null;
        setFilePreview(null);
        setFileSelected(null);
    };

    const handleMultiFileRemove = (index) => {
        const newFiles = multiFiles.filter((_, i) => i !== index);
        const newPreviews = multiFilePreviews.filter((_, i) => i !== index);
        setMultiFiles(newFiles);
        setMultiFilePreviews(newPreviews);
    };

    return (
        <MainPage loading={loading}>
            <div style={{ padding: 10 }}>
                <Form
                    title={formCat.getFieldValue("id") == null ? "New Post" : "Update Post"}
                    open={open}
                    form={formCat}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 5 }}>
                        <Button onClick={() => navigate("/post-list-page")} type="primary">
                            <ArrowLeftOutlined />Back
                        </Button>
                        <Space>
                            <Button onClick={() => setOpen(true)} type="primary" htmlType="submit">
                                <MdOutlinePostAdd /> Create Post
                            </Button>
                        </Space>
                    </div>
                    <hr />

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="User"
                                name="userId"
                                rules={[{ required: true, message: "Please select a User!" }]}
                            >
                                 <Select>
                                    {/* {user?.mobile} */}
                                    {user.map((item) => (
                                        <Select.Option key={item.id} value={item.id}>{item.mobile}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Department"
                                name="departmentId"
                                rules={[{ required: true, message: "Please select a Department!" }]}
                            >
                                <Select>
                                    {category.map((item) => (
                                        <Select.Option key={item.id} value={item.id}>{item.Name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label="Summary"
                                name="summary"
                                rules={[{ required: true, message: "Please input summary!" }]}
                            >
                                <Input placeholder="summary" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <hr />
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Upload Cover Image"
                                rules={[{ required: true, message: "Please upload a cover image!" }]}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', marginRight: 10 }}>
                                        {filePreview && (
                                            <CloseOutlined
                                                onClick={handleFileRemove}
                                                style={{
                                                    color: "red",
                                                    fontSize: 18,
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: -6,
                                                    backgroundColor: "#EEE",
                                                    padding: 3
                                                }}
                                            />
                                        )}
                                        {filePreview ? (
                                            <img
                                                src={filePreview}
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                alt="preview"
                                            />
                                        ) : (
                                            <div style={{ width: 100, height: 100, backgroundColor: '#EEE' }}></div>
                                        )}
                                    </div>
                                    <div>
                                        <input onChange={handleFileChange} ref={fileRef} type="file" id="selectedFile" style={{ display: "none" }} />
                                        <Button
                                            icon={<UploadOutlined />}
                                            onClick={() => document.getElementById('selectedFile').click()}
                                        >
                                            Browse...
                                        </Button>
                                    </div>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="title"
                                name="title"
                                rules={[{ required: true, message: "Please input title!" }]}
                            >
                                <Input placeholder="title" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Content"
                                name="content"
                                rules={[{ required: true, message: "Please input Content!" }]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    placeholder="Content"
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
                </Form>
            </div>
        </MainPage>
    );
};

export default PostPage;
