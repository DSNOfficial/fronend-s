import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Table, Button, Space, Modal, Input, Form, Select, message, Tag, DatePicker, Image, Upload, Row, Col } from "antd"
import MainPage from "../component/page/MainPage";
import { Config, formartDateClient, formartDateServer, isEmptyOrNull } from "../config/helper";
import { CloseOutlined, DeleteFilled, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ImageSlideShowPage = () => {
    const multiFileRef = useRef(null);
    const [multiFilePreviews, setMultiFilePreviews] = useState([]);
    const [category, setCategory] = useState([]);
    const [multiFiles, setMultiFiles] = useState([]);
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: '',
        }
    ]);

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [formCat] = Form.useForm();

    useEffect(() => {
        formCat.setFieldsValue({
            Status: "1"
        });
        getList();
    }, []);

    const filterRef = useRef({
        txt_search: null,
        status: null
    });
    const fileRef = useRef(null);

    const getList = async () => {
        setLoading(true);
        var param = {
            txt_search: filterRef.current.txt_search,
        };
        const res = await request("post/getlist", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
            setCategory(res.category);
        }
    };

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({
            ...item,
            "Image": item.Image
        });
        setFilePreview(Config.image_path + item.Image);
        setOpen(true);
    };

    const onClickBtnDelete = async (item) => {
        Modal.confirm({
            title: "លុប",
            content: "តើលោកអ្នកចង់លុបមែន ឬទេ?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                var data = {
                    id: item.id
                };
                const res = await request("post/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            }
        });
    };

    const onFinish = async (item) => {
        var id = formCat.getFieldValue("id");
        var form = new FormData();
        form.append("id", id);
        form.append("title", item.title);
        form.append("metaTitle", item.metaTitle);
        form.append("slug", item.slug);
        form.append("content", item.content);
        form.append("published", item.published);
        form.append("authorId", item.authorId);
        form.append("parentId", item.parentId);
        form.append("PreImage", formCat.getFieldValue("Image"));
        if (fileSelected != null) {
            form.append("image", fileSelected);
        }
        var method = (id == null ? "post" : "put")
        var url = (id == null ? "post/create" : "post/update")
        const res = await request(url, method, form);
        if (res) {
            message.success(res.message);
            getList();
            onCloseModule();
        }
    };

    const onTextSearch = (value) => {
        filterRef.current.txt_search = value;
        getList();
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = (e.target.value);
        getList();
    };

    const onChangeStatus = (value) => {
        filterRef.current.status = value;
        getList();
    };

    const onCloseModule = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            Status: "1"
        });
        setOpen(false);
    };

    const navigate = useNavigate();

    const onClickCreatePost = () => {
        navigate("/post-create-page");
    };

    const onChnageFile = (e) => {
        var file = e.target.files[0];
        var filePreview = URL.createObjectURL(file);
        setFileSelected(file);
        setFilePreview(filePreview);
    };

    const onRemoveFileSelected = () => {
        fileRef.current.value = null;
        setFilePreview(null);
        setFileSelected(null);
    };

    const onChangeMultiFiles = (e) => {
        const files = Array.from(e.target.files);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setMultiFiles(files);
        setMultiFilePreviews(filePreviews);
    };

    const onRemoveMultiFileSelected = (index) => {
        const newFiles = multiFiles.filter((_, i) => i !== index);
        const newPreviews = multiFilePreviews.filter((_, i) => i !== index);
        setMultiFiles(newFiles);
        setMultiFilePreviews(newPreviews);
    };

    const onView = (item) => {
        setSelectedPost(item);
        setViewOpen(true);
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">Post</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="Search" onSearch={onTextSearch} />
                </Space>
                <Button onClick={onClickCreatePost} type="primary"> Add New</Button>
            </div>
            <Table
                dataSource={list}
                pagination={{
                    pageSize: 7,
                }}
                columns={[
                    {
                        key: "No",
                        title: "No",
                        dataIndex: "title",
                        render: (value, item, index) => (index + 1)
                    },
                    {
                        key: "authorId",
                        title: "authorId",
                        dataIndex: "authorId",
                    },
                    {
                        key: "parentId",
                        title: "parentId",
                        dataIndex: "parentId",
                    },
                    {
                        key: "title",
                        title: "title",
                        dataIndex: "title",
                    },
                    {
                        key: "metaTitle",
                        title: "metaTitle",
                        dataIndex: "metaTitle",
                    },
                    {
                        key: "slug",
                        title: "slug",
                        dataIndex: "slug",
                    },
                    {
                        key: "Image",
                        title: "Image",
                        dataIndex: "Image",
                        render: (value) => {
                            if (value != null && value != "") {
                                return (
                                    <Image
                                        src={Config.image_path + value}
                                        alt=""
                                        width={60} />
                                );
                            } else {
                                return (
                                    <div style={{ height: 30, width: 25, backgroundColor: "#888" }} />
                                );
                            }
                        }
                    },
                    {
                        key: "content",
                        title: "content",
                        dataIndex: "content",
                        render: (value) => {
                            if (typeof value === 'string') {
                                return <span dangerouslySetInnerHTML={{ __html: value }} />;
                            }
                        }
                    },
                    {
                        key: "Action",
                        title: "Action",
                        dataIndex: "Status",
                        render: (value, item, index) => (
                            <Space>
                                <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                                <Button onClick={() => onView(item)}>View</Button>
                            </Space>
                        )
                    }
                ]} />
            <Modal
                centered
                footer={false}
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                title="View Post"
            >
                <div>
                    <h3>{selectedPost?.title}</h3>
                    <p>{selectedPost?.content}</p>
                    {selectedPost?.Image && (
                        <Image
                            src={Config.image_path + selectedPost.Image}
                            alt=""
                            width={100}
                        />
                    )}
                </div>
            </Modal>
        </MainPage>
    );
}

export default ImageSlideShowPage;
