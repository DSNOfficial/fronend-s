import { useEffect, useState, useRef } from "react";
import {
  Table, Button, Space, Modal, Input, Form, Select, message, Row, Col, Upload, Divider,
} from "antd";
import MainPage from "../component/page/MainPage";
import { Config, formatDateClient } from "../config/helper";
import "../component/assets/css/TextEditor.css";
import { request } from "../config/request";
import dayjs from "dayjs";
import {
  CloseOutlined, UploadOutlined, EyeOutlined,
  PlusOutlined, DeleteOutlined, FormOutlined,
  ExclamationCircleOutlined, CloseCircleOutlined,
  SaveOutlined
} from "@ant-design/icons";

const UserPage = () => {
  const [list, setList] = useState([]);
  const [role, setRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formCat] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);


  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewImage, setViewImage] = useState(null);



  const filterRef = useRef({ txt_search: null, status: null });

  useEffect(() => {
    getList();
    formCat.setFieldsValue({ Status: "1" });
  }, []);

  const getList = async () => {
    setLoading(true);
    const param = {
      txt_search: filterRef.current.txt_search,
      status: filterRef.current.status,
    };
    const res = await request("user/getlist", "get", param);
    setLoading(false);
    if (res) {
      setList(res.list);
      setRole(res.role);
    }
  };

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const onClickBtnEdit = (item) => {
    formCat.setFieldsValue({ ...item });
    if (item.image) {
      const file = [{
        uid: '-1',
        name: item.image,
        status: 'done',
        url: Config.image_path + item.image,
      }];
      setFileList(file);
    }
    setOpen(true);
  };

  const onClickBtnView = (item) => {
  setViewData(item);
  setViewImage(item.image ? `${Config.image_path}${item.image}` : null);
  setViewModalOpen(true);
};


  const onClickBtnDelete = (item) => {
    Modal.confirm({
      title: "លុប",
      content: "តើលោកអ្នកចង់លុបមែន ឬទេ?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      onOk: async () => {
        const res = await request("user/delete", "delete", { id: item.id });
        if (res) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  const onClickBtnSetPassword = (item) => {
    setSelectedUser(item);
    formPassword.resetFields();
    setPasswordModalOpen(true);
  };

  const onFinish = async (item) => {
    const form = new FormData();
    form.append("RoleId", item.RoleId);
    form.append("firstName", item.firstName);
    form.append("middleName", item.middleName || '');
    form.append("lastName", item.lastName);
    form.append("mobile", item.mobile);
    form.append("email", item.email);
    form.append("intro", item.intro || '');
    form.append("profile", item.profile || '');
    if (item.Password) form.append("Password", item.Password);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      form.append("upload_image", fileList[0].originFileObj);
    }

    if (formCat.getFieldValue("id")) {
      form.append("id", formCat.getFieldValue("id"));
    }

    const method = formCat.getFieldValue("id") == null ? "post" : "put";
    const url = method === "post" ? "user/create" : "user/update";
    const res = await request(url, method, form);

    if (res) {
      message.success(res.message);
      getList();
      onCloseModule();
    }
  };

  const onFinishPassword = async (values) => {
    const data = {
      mobile: selectedUser.mobile,
      Password: values.Password,
      ConfirmPassword: values.ConfirmPassword,
    };
    const res = await request("user/setpassword", "post", data);
    if (res) {
      message.success(res.message);
      setPasswordModalOpen(false);
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

  const onCloseModule = () => {
    formCat.resetFields();
    setFileList([]);
    setOpen(false);
  };

  const toKhmerNumeral = (num) => {
    const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return num.toString().split('').map(d => khmerNumerals[d]).join('');
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
          <div className="txt_title" style={{ fontSize: 16 }}>បញ្ជីគណនីអ្នកប្រើប្រាស់</div>
          <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" />
        </Space>
        <Button onClick={() => setOpen(true)} type="primary"><PlusOutlined />បន្ថែមថ្មី</Button>
      </div>
      <hr />
      <Table
        dataSource={list}
        pagination={{ pageSize: 7 }}
        columns={[
          {
            key: "No",
            title: "ល.រ",
            align: 'left',
            width: 60,
            render: (value, item, index) => index + 1,
          },
          { key: "mobile", title: "គណនី", dataIndex: "mobile" },
          { key: "email", title: "អ៊ីម៉ែល", dataIndex: "email" },
          {
            key: "RoleId",
            title: "ការអនុញ្ញាត",
            dataIndex: "RoleId",
            render: (RoleId) => role.find(r => r.id === RoleId)?.name || 'Unknown',
          },
          {
            key: "create_at",
            title: "ថ្ងៃបង្កើត",
            dataIndex: "created_at",
            render: formatKhmerDate
          },
         {
  key: "Action",
  title: "កែប្រែ / លុប​ / ប្តូរពាក្យសម្ងាត់",
  render: (value, item) => (
    <Space>
      <Button onClick={() => onClickBtnView(item)} type="default"><EyeOutlined /> មើល</Button>
      <Button onClick={() => onClickBtnEdit(item)}><FormOutlined /> កែប្រែ</Button>
      <Button onClick={() => onClickBtnDelete(item)} danger><DeleteOutlined /> លុប</Button>
      <Button onClick={() => onClickBtnSetPassword(item)} type="primary"><ExclamationCircleOutlined /> ប្តូរពាក្យសម្ងាត់</Button>
    </Space>
  ),
}
,
        ]}
      />

      {/* Image Preview Modal */}
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      {/* User Modal */}
      <Modal
        title={formCat.getFieldValue("id") == null ? "គណនី | បន្ថែមថ្មី" : "គណនី | កែប្រែ"}
        open={open}
        onCancel={onCloseModule}
        footer={null}
        maskClosable={false}
      >
        <Form form={formCat} layout="vertical" onFinish={onFinish}>
          <Row gutter={5}>
            <Col span={24}>
              <Form.Item
                label="រូបថត"
                name="upload_image"
                labelCol={{ span: 24 }}
                style={{ textAlign: 'center', marginBottom: 0 }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", paddingTop: 10, paddingBottom: 10 }}>
                  <Upload
                    listType="picture-circle"
                    beforeUpload={() => false}
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={({ fileList }) => setFileList(fileList)}
                    maxCount={1}
                  >
                    {fileList.length >= 1 ? null : (
                      <div style={{ textAlign: "center" }}>
                        <PlusOutlined style={{ fontSize: 20 }} />
                        <div style={{ marginTop: 6, fontSize: 14 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                  <h3 style={{ margin: 0, fontWeight: "normal", fontSize: 16, color: "#555", textAlign: "center" }}>
                    រូបភាពរបស់អ្នក
                  </h3>
                </div>
              </Form.Item>
            </Col>

            <Divider />
            <Col span={12}><Form.Item label="គណនី" name="mobile" rules={[{ required: true, message: "សូមបំពេញគណនី!" }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="អ៊ីម៉ែល" name="email" rules={[{ required: true, message: "សូមបំពេញអ៊ីមែល!" }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="គោត្តនាម" name="firstName" rules={[{ required: true, message: "សូមបំពេញគោត្តនាម!" }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="នាម" name="lastName" rules={[{ required: true, message: "សូមបំពេញនាម!" }]}><Input /></Form.Item></Col>
            <Col span={24}><Form.Item label="ការអនុញ្ញាត" name="RoleId" rules={[{ required: true, message: "សូមបំពេញការអនុញ្ញាត!" }]}>
              <Select placeholder="Please select role">
                {role.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
              </Select>
            </Form.Item></Col>
          </Row>

          {formCat.getFieldValue("id") == null && (
            <Row gutter={5}>
              <Col span={12}>
                <Form.Item label="កំណត់ពាក្យសម្ងាត់" name="Password" rules={[{ required: true, message: "សូមបំពេញពាក្យសម្ងាត់!" }]}>
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់" name="ConfirmPassword" dependencies={['Password']}
                  rules={[
                    { required: true, message: "សូមបំពេញពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('Password') === value) return Promise.resolve();
                        return Promise.reject(new Error('ពាក្យសម្ងាត់មិនដូចគ្នា!'));
                      },
                    }),
                  ]}>
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row>
            <Col span={24}><Form.Item label="ផ្សេងៗ​ (មិនបំពេញក៏បាន)" name="intro"><Input /></Form.Item></Col>
          </Row>

          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCloseModule}><CloseCircleOutlined />បដិសេធ</Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined />{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Password Modal */}
      <Modal title="ការកំណត់ពាក្យសម្ងាត់" open={passwordModalOpen} onCancel={() => setPasswordModalOpen(false)} footer={null} maskClosable={false}>
        <Form form={formPassword} layout="vertical" onFinish={onFinishPassword}>
          <Row gutter={5}>
            <Col span={24}>
              <Form.Item label="កំណត់ពាក្យសម្ងាត់" name="Password" rules={[{ required: true, message: "សូមបំពេញពាក្យសម្ងាត់!" }]}>
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់" name="ConfirmPassword" dependencies={['Password']}
                rules={[
                  { required: true, message: "សូមបំពេញពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('Password') === value) return Promise.resolve();
                      return Promise.reject(new Error('ពាក្យសម្ងាត់មិនដូចគ្នា!'));
                    },
                  }),
                ]}>
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setPasswordModalOpen(false)}><CloseCircleOutlined />បដិសេធ</Button>
              <Button type="primary" htmlType="submit"><ExclamationCircleOutlined />ប្តូរពាក្យសម្ងាត់</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
  <Modal
  title="ព័ត៌មានអ្នកប្រើប្រាស់"
  open={viewModalOpen}
  onCancel={() => setViewModalOpen(false)}
  footer={null}
  width={600}
>
  {viewData && (
    <Row gutter={16}>
      <Col span={8}>
        <img
          src={viewImage || "https://via.placeholder.com/150"|| ""||null}
          alt="profile"
          style={{ width: "100%", borderRadius: 10 }}
        />
      </Col>
      <Col span={16}>
        <p><strong>ឈ្មោះ:</strong> {viewData.firstName} {viewData.lastName}</p>
        <p><strong>អ៊ីម៉ែល:</strong> {viewData.email}</p>
        <p><strong>លេខទូរស័ព្ទ:</strong> {viewData.mobile}</p>
        <p><strong>ការអនុញ្ញាត:</strong> {role.find(r => r.id === viewData.RoleId)?.name || "N/A"}</p>
        <p><strong>ផ្សេងៗ:</strong> {viewData.intro || "-"}</p>
        <p><strong>ថ្ងៃបង្កើត:</strong> {formatKhmerDate(viewData.created_at)}</p>
      </Col>
    </Row>
  )}
</Modal>


    </MainPage>
  );
};

export default UserPage;
