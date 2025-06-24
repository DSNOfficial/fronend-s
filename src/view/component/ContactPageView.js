import { useEffect, useState } from "react";
import { request } from "../../config/request";
import ReCAPTCHA from 'react-google-recaptcha';
import Logo4 from "../../component/assets/image/a.png";
import './InstructurePageView.css';

import { Col, Row, Button, Form, Input, Image, Card, Divider, message } from 'antd';
import GoogleFormEmbed from "./GoogleFormEmbed";

const { TextArea } = Input;

const cardStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "auto",
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
  borderRadius: "8px",
  overflow: "hidden",
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const formContainerStyle = {
  padding: "40px",
  fontFamily: 'KhmerOSSiemReap',
  color:"#343293",
  

};

const ContactPageView = () => {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [formCat] = Form.useForm();

  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
      message.success(successMessage);
      localStorage.removeItem('successMessage');
    }
  }, []);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleFormSubmit = async (item) => {
    if (!captchaValue) {
      message.error("សូមធ្វើការធ្វើរឿងដើម្បីបំពេញ reCAPTCHA!");
      return;
    }
    
    // Rest of your form submission logic
    const id = formCat.getFieldValue("id");
    const data = {
      id: id,
      Title: item.Title,
      Email: item.Email,
      Massage: item.Massage,
      Phone: item.Phone,
    };
    const method = id == null ? "post" : "put";
    const url = id == null ? "massage/create" : "massage/update";
    const res = await request(url, method, data);
    if (res) {
      localStorage.setItem('successMessage', res.message);
      formCat.resetFields();
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" ,fontFamily:"KhmerOSSiemReap"}}>
      <Card hoverable style={cardStyle}>
        <Row gutter={0} align="middle">
          <Col xs={24} md={12}>
            <div className="image-container">
              <Image src={Logo4} preview={false} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="form-container" style={formContainerStyle}>
              <h3>ទំនាក់ទំនងជាមួយអ៊ីម៉ែល</h3>
              <h4>សូមសួរសំណួរណាមួយមកយើងខ្ញុំ</h4>
              <Divider />
              <Form
                style={{color:'#343293'}}
                layout="vertical"
                onFinish={handleFormSubmit}
                form={formCat}
              >
                <Form.Item
                  // style={{color:'#343293'}}
                  label={<span style={{ color: '#343293' }}>ឈ្មោះ</span>}          
                  name="Title"
                  rules={[{ required: true, message: 'សូមបំពេញឈ្មោះ' }]}
                >
                  
                  <Input placeholder="ឈ្មោះ" />
                </Form.Item>
                <Form.Item                 
                  label={<span style={{ color: '#343293' }}>ទូរស័ព្ទ</span>}
                  name="Phone"
                  rules={[{ required: true, message: 'សូមបំពេញទូរស័ព្ទ' }]}
                >
                  <Input placeholder="ទូរស័ព្ទ" />
                </Form.Item>
                <Form.Item
                style={{color:'#343293'}}  
                  label={<span style={{ color: '#343293' }}>អ៊ីម៉ែល </span>}
                  name="Email"
                  rules={[
                    // { required: true, message: 'សូមបំពេញអ៊ីម៉ែល' },
                    { type: 'email', message: 'សូមត្រួតពិនិត្យឡើយវិញ អ៊ីម៉ែលរបស់លោក!' },
                  ]}
                >
                  <Input placeholder="អ៊ីម៉ែល" />
                </Form.Item>
                <Form.Item                
                  label={<span style={{ color: '#343293' }}>ប្រអប់សំបុត្រ</span>}   
                  name="Massage"
                >
                  <TextArea rows={4} placeholder="ប្រអប់សំបុត្រ" maxLength={100} />
                </Form.Item>
                <Form.Item>
                  <ReCAPTCHA
                    sitekey="6Lf8XpQqAAAAALGB55TgpgRTp8o7rva81ZwFIxIu" // Replace with your reCAPTCHA site key
                    onChange={handleCaptchaChange}
                  />
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit" style={{backgroundColor:'#343293'}}>ដាក់ស្នើសុំ</Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
        {/* <Row gutter={0} align="middle">
        
          <Form>
          <Col xs={24} md={24}>
        <div>
       {/* // <GoogleFormEmbed/> */}
         {/* </div> */}
      {/* </Col>
    
          </Form>

        </Row> */} 
      </Card>
     
    </div>
  );
}

export default ContactPageView;
