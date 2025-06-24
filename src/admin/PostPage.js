import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Table, Button, Space, Modal, Input, Form, Select, message, Tag, DatePicker, Image, Upload, Row, Col } from "antd";
import MainPage from "../component/page/MainPage";
import { Config, formartDateClient, formartDateServer, isEmptyOrNull } from "../config/helper";
import { CloseOutlined, DeleteFilled, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const PostPage = () => {
    const multiFileRef = useRef(null);
    const [multiFilePreviews, setMultiFilePreviews] = useState([]); 
    const [category, setCategory] = useState([]);
    const [user, setUser] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // Track if in edit mode
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
        const res = await request("tbpost/getlist", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
            setCategory(res.category);
            setUser(res.user || []);
        }
    };

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({
            ...item,
            "Image": item.Image
        });
        setFilePreview(Config.image_path + item.Image);
        setOpen(true);
        setIsEditMode(true); // Set to edit mode
    };

    const onClickBtnDelete = async (item) => {
        Modal.confirm({
            title: "Delete",
            content: "Are you sure you want to delete?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                var data = {
                    id: item.id
                };
                const res = await request("tbpost/delete", "delete", data);
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
        form.append("userId", item.userId);
        form.append("departmentId", item.departmentId);
        form.append("title", item.title);
        form.append("summary", item.summary);
        form.append("content", item.content);

        // Append existing image if no new image is selected
        if (fileSelected != null) {
            form.append("image", fileSelected);
        } else {
            form.append("PreImage", formCat.getFieldValue("Image"));
        }

        var method = (id == null ? "post" : "put");
        var url = (id == null ? "tbpost/create" : "tbpost/update");
        const res = await request(url, method, form);
        if (res) {
            message.success(res.message);
            getList();
            onCloseModule();
            window.location.reload();  // Refresh the page
        }
    };

    const onTextSearch = (value) => {
        // filterRef.current.txt_search = value // set value to ref key txt_search
        // // var x = filterRef.current.txt_search // get 
        // getList();
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
        setIsEditMode(false); // Reset mode
    };

    const navigate = useNavigate();
    
    const onClickCreatePost = () => {
        navigate("/post-create-page");
    };

    const onChnageFile = (e) => {
        const file = e.target.files[0];
        if (isEditMode) {
            Modal.confirm({
                title: "Change Image",
                content: "Are you sure you want to change the image?",
                okText: "Yes",
                cancelText: "No",
                onOk: () => {
                    const filePreview = URL.createObjectURL(file);
                    setFileSelected(file);
                    setFilePreview(filePreview);
                },
                onCancel: () => {
                    fileRef.current.value = null;
                }
            });
        } else {
            const filePreview = URL.createObjectURL(file);
            setFileSelected(file);
            setFilePreview(filePreview);
        }
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

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">Post</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="Search" onSearch={onTextSearch} />
                </Space>
                <Button onClick={onClickCreatePost} type="primary">Add New</Button>
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
                        key: "userId",
                        title: "userId",
                        dataIndex: "userId",
                    },
                    {
                        key: "departmentId",
                        title: "departmentId",
                        dataIndex: "departmentId",
                    },
                    {
                        key: "title",
                        title: "title",
                        dataIndex: "title",
                    },
                    {
                        key: "summary",
                        title: "summary",
                        dataIndex: "summary",
                    },
                    {
                        key: "Image",
                        title: "Image",
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
                        key: "content",
                        title: "content",
                        dataIndex: "content",
                        ellipsis: true,
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
                                <Button onClick={() => onClickBtnEdit(item)} type="primary">Edit</Button>
                                <Button onClick={() => onClickBtnDelete(item)} type="primary" danger>Delete</Button>
                            </Space>
                        )
                    }
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "New Post" : "Update Post"}
                open={open}
                maskClosable={false}
                onCancel={(onCloseModule)}
                okText="Save"
                footer={null}
                width="100%"
                height="100%"
            >
                <Form
                    form={formCat}
                    layout="vertical"
                    onFinish={onFinish}
                >
                   <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="User"
                                name="userId"
                                rules={[{ required: true, message: "Please select a User!" }]}
                            >
                                 <Select>
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
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Summary"
                                name={"summary"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input Summary!!",
                                    }
                                ]}
                            >
                                <Input style={{ width: "100%" }} placeholder="Summary" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Upload Cover Image"
                    >
                        <>
                            <div style={{ width: "20%", position: 'relative' }}>
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
                            <input onChange={onChnageFile} ref={fileRef} type="file" id="selectedFile" style={{ display: "none" }} />
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
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label="title"
                                name={"title"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input title!!",
                                    }
                                ]}
                            >
                                <Input style={{ width: "100%" }} placeholder="title" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="content"
                        name={"content"}
                    >
                        <ReactQuill
                            theme="snow"
                            placeholder="content"
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ size: [] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                    { 'indent': '-1' }, { 'indent': '+1' }],
                                    ['link'],
                                    ['clean']
                                ]
                            }}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "Right" }}>
                        <Space>
                            <Button onClick={onCloseModule}>Cancel</Button>
                            <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "Save" : "Update"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </MainPage>
    );
};

export default PostPage;
