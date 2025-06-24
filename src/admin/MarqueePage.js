import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, Image, Row, Col } from "antd";
import { Config, isEmptyOrNull } from "../config/helper";
import MainPage from "../component/page/MainPage";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const MarqueePageView = () => {
    const [list, setList] = useState([]);
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false); // State for view modal
    const [selectedMarquee, setSelectedMarquee] = useState(null); // State for selected marquee details
    const [formCat] = Form.useForm();
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        formCat.setFieldsValue({ Status: "1" });
        getList();
        getCodes();
    }, [formCat]);

    const filterRef = useRef({ txt_search: null, status: null, code_id: null });
    const fileRef = useRef(null);

    const generateUniqueCode = () => {
        const currentYear = new Date().getFullYear();
        const highestCode = codes.reduce((max, code) => {
            const [prefix, num, year] = code.code.split("-");
            const codeYear = parseInt(year, 10);
            if (codeYear === currentYear) {
                const codeNum = parseInt(num, 10);
                return codeNum > max ? codeNum : max;
            }
            return max;
        }, 0);
        const nextCode = highestCode + 1;
        return `CODE-${String(nextCode).padStart(3, '0')}-${currentYear}`;
    };

    const getList = async () => {
        setLoading(true);
        try {
            const param = {
                txt_search: filterRef.current.txt_search,
                status: filterRef.current.status,
                code_id: filterRef.current.code_id,
            };
            const res = await request("tbmarquee/getList", "get", param);
            if (res) setList(res.list);
        } catch (error) {
            message.error("Failed to fetch list");
        } finally {
            setLoading(false);
        }
    };

    const getCodes = async () => {
        try {
            const res = await request("coder/getList", "get");
            if (res) setCodes(res.list);
        } catch (error) {
            message.error("Failed to fetch codes");
        }
    };

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({ ...item, image: item.Image, code_id: item.code_id });
        setFilePreview(Config.image_path + item.Image);
        setOpen(true);
    };

    const onClickAddNew = () => {
        formCat.setFieldsValue({
            Status: "1",
            code_id: generateUniqueCode()
        });
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
                    const res = await request("tbmarquee/delete", "delete", { id: item.id });
                    if (res) {
                        message.success(res.message);
                        getList();
                    }
                } catch (error) {
                    message.error("Failed to delete item");
                }
            }
        });
    };

    const onClickBtnView = (item) => {
        setSelectedMarquee(item);
        setViewOpen(true);
    };

    const onFinish = async (item) => {
        try {
            const id = formCat.getFieldValue("id");
            const form = new FormData();
            form.append("id", id);
            form.append("title", item.title);
            form.append("description", item.description);
            form.append("code_id", item.code_id);
            form.append("PreImage", formCat.getFieldValue("image"));
            if (fileSelected) form.append("image", fileSelected);

            const method = id == null ? "post" : "put";
            const url = id == null ? "tbmarquee/create" : "tbmarquee/update";
            const res = await request(url, method, form);

            if (res?.error) {
                const mgs = Object.values(res.message).join("");
                message.error(mgs);
            } else {
                message.success(res.message);
                getList();
                onCloseModal();
            }
        } catch (error) {
            message.error("Failed to save item");
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
        formCat.setFieldsValue({ Status: "1" });
        setOpen(false);
        onRemoveFileSelected();
    };

    const onChangeFile = (e) => {
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

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">អក្សររត់</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" />
                </Space>
                <Button onClick={onClickAddNew} type="primary">បន្ថែមថ្មី</Button>
            </div>
            <Table
                dataSource={list}
                pagination={{ pageSize: 5 }}
                columns={[
                    {
                        key: "No",
                        title: "No",
                        align: 'left',
                        width: 60,
                        render: (value, item, index) => index + 1
                    },
                    {
                        key: "title",
                        title: "ចំណង់ជើង",
                        dataIndex: "title",
                        ellipsis: true,
                    },
                    {
                        key: "description",
                        title: "មាតិកា",
                        dataIndex: "description",
                        ellipsis: true,
                        width: 300,
                    },
                    {
                        key: "Image",
                        title: "រូបភាព",
                        dataIndex: "Image",
                        render: (value) => (
                            value ? (
                                <Image src={Config.image_path + value} alt="" width={60} />
                            ) : (
                                <div style={{ height: 40, width: 60, backgroundColor: "#888" }} />
                            )
                        )
                    },
                    {
                        key: "Action",
                        title: "ដំណើរការបន្ថែម",
                        align: 'right',
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
            <Modal
                title={formCat.getFieldValue("id") == null ? "អក្សររត់ | បន្ថែមថ្មី" : "អក្សររត់ | កែប្រែ"}
                open={open}
                onCancel={onCloseModal}
                footer={null}
                width={600}
                maskClosable={false}
            >
                <Form form={formCat} layout="vertical" onFinish={onFinish}>
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label="ចំណង់ជើង"
                                name={"title"}
                                rules={[{ required: true, message: 'សូមបំពេញចំណង់ជើង!' }]}
                            >
                                <Input placeholder="ចំណង់ជើង" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label="មាតិកា"
                                name={"description"}
                                rules={[{ required: true, message: "សូមបំពេញមាតិកា!" }]}
                            >
                                <TextArea style={{ width: "100%" }} placeholder="មាតិកា" rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item label="Upload រូបភាព">
                                <>
                                    <div style={{ width: "90%", position: 'relative' }}>
                                        {!isEmptyOrNull(filePreview) && (
                                            <CloseOutlined
                                                onClick={onRemoveFileSelected}
                                                style={{ color: "red", fontSize: 18, position: 'absolute', top: -6, right: -6, backgroundColor: "#EEE", padding: 3 }}
                                            />
                                        )}
                                        {!isEmptyOrNull(filePreview) ? (
                                            <img src={filePreview} style={{ width: "90%" }} alt="" />
                                        ) : (
                                            <div style={{ width: 70, height: 70, backgroundColor: '#EEE' }}></div>
                                        )}
                                    </div>
                                    <input onChange={onChangeFile} ref={fileRef} type="file" id="selectedFile" style={{ display: "none" }} />
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
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label="Code"
                                name={"code_id"}
                            >
                                <Select placeholder="Select a code">
                                    <Option key="generated" value={formCat.getFieldValue("code_id")}>
                                        {formCat.getFieldValue("code_id")}
                                    </Option>
                                    {codes.map((code) => (
                                        <Option key={code.id} value={code.id}>{code.code}</Option>
                                    ))}
                                </Select>
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
            <Modal
                title="មើលអក្សររត់"
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                footer={null}
                width={600}
                maskClosable={true}
            >
                {selectedMarquee && (
                    <div>
                        <p><strong>ចំណង់ជើង:</strong> {selectedMarquee.title}</p>
                        <p><strong>មាតិកា:</strong> {selectedMarquee.description}</p>
                        {/* <p><strong>Code:</strong> {selectedMarquee.code_id}</p> */}
                        <br></br>
                        {selectedMarquee.Image && (
                            <div>
                                <strong>រូបភាព:<br></br></strong>
                                <Image src={Config.image_path + selectedMarquee.Image} alt="" width={200} />
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </MainPage>
    );
};

export default MarqueePageView;
