import React, { useState } from 'react';
import Iframe from 'react-iframe';
import { Card, Col, Row, Divider, Button } from 'antd';
import { TikTokOutlined, FacebookOutlined, MailOutlined } from '@ant-design/icons';
import { BiLogoTelegram } from "react-icons/bi";
import { NavLink } from 'react-router-dom';


// Custom styles for the container and list
const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
};

const paragraphStyle = {
  textAlign: "justify",
  textJustify: "inter-word",
  color:'#343293',

};

const listStyle = {
  listStyleType: 'none', // Remove bullet points
  paddingLeft: '0',  // Remove indentation
  color:'#343293',
};

const newsHeaderStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333',
  color:'#343293',

  marginBottom: '12px',
};

const listItemStyle = {
  fontSize: '16px',
  marginBottom: '6px',
  color:'#343293',
};

const fontColor = {
  color: '#34408c' ,
  fontSize: '20px',
  fontWeight: 'bold',

};

const socialButtonStyle = {
  default: {
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  facebook: {
    backgroundColor: '#1877f2',
    color: '#ffffff'
  },
  telegram: {
    backgroundColor: '#0088cc',
    color: '#ffffff'
  },
  email: {
    backgroundColor: '#ff0000',
    color: '#ffffff'
  }
};

const FooterPageView = () => {
  const [loading, setLoading] = useState(false);

  const handleClickList = (key) => {
  setLoading(true);
  setTimeout(() => {
  }, 500); // Adjust delay as needed
};
  return (
    <div style={containerStyle}>
      <Row gutter={[16, 16]}> 
        <Col xs={24} sm={12} lg={8}> 
          <div title="Location">
            <h3 style={fontColor}>ទីតាំងរបស់មន្ទីរពេទ្យជាតិ តេជោសន្តិភាព</h3>
            <Divider />
            <Iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15632.240039949625!2d104.8140681!3d11.6190721!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31094d0ed2f142e7%3A0xbb44c329370f82fd!2sTecho%20Santepheap%20National%20Hospital!5e0!3m2!1sen!2skh!4v1714103183404!5m2!1sen!2skh"
              width="100%"
              height="250px" // Fixed height for responsive iframes
              frameBorder="0"
              style={{ border: 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              <Button type="default" shape="circle" style={socialButtonStyle.facebook}>
                <a  href='https://web.facebook.com/tsnhhospital'><FacebookOutlined style={{ color: socialButtonStyle.facebook.color }} /></a>
              </Button>
              <Button type="default" shape="circle" style={socialButtonStyle.default}>
                <a href='https://www.tiktok.com/@tsnhtechosantepheap'><TikTokOutlined /></a>
              </Button>
              <Button type="default" shape="circle" style={socialButtonStyle.telegram}>
                <a href='https://t.me/tsnh_hospital001'><BiLogoTelegram style={{ color: socialButtonStyle.telegram.color }} /></a>
              </Button>
              <Button type="default" shape="circle" style={socialButtonStyle.email}>
                <MailOutlined style={{ color: socialButtonStyle.email.color }} />
              </Button>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <div style={paragraphStyle}>
            <h3 style={fontColor} >ព័ត៌មានទូទៅ</h3>
            <Divider />

            <ul style={listStyle}>
  <li
    style={listItemStyle}
    title="ដៃគូសហការ"
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
  >
    <NavLink to="/page/partners" style={listStyle}>ដៃគូសហការ</NavLink>
  </li>
  <li
    style={listItemStyle}
    title="វគ្គបណ្តុះបណ្តាល"
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
  >
    <NavLink to="/page/trainers" style={listStyle}>វគ្គបណ្តុះបណ្តាល</NavLink>
  </li>
  <li
    style={listItemStyle}
    title="បេសកកម្ម"
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
  >
    <NavLink to="/page/mission" style={listStyle}>បេសកកម្ម</NavLink>
  </li>
  <li
    style={listItemStyle}
    title="អនុក្រឹត្យ"
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
  >
    <NavLink to="/page/books" style={listStyle}>ច្បាប់ និងបទដ្ឋានគតិយុត្ត</NavLink>
  </li>
</ul>



            {/* <ul style={listStyle}> 
              <li style={listItemStyle} title="ដៃគូសហការ"><NavLink to="/page/partners" style={listStyle}>ដៃគូសហការ</NavLink></li>
              <li style={listItemStyle} title="វគ្គបណ្តុះបណ្តាល"><NavLink to="/page/trainers" style={listStyle}>វគ្គបណ្តុះបណ្តាល</NavLink></li>
              <li style={listItemStyle} title="បេសកកម្ម"><NavLink to="/page/mission" style={listStyle}>បេសកកម្ម</NavLink></li>
              <li style={listItemStyle} title="អនុក្រឹត្យ"><NavLink to="/page/books"style={listStyle} >ច្បាប់ និងបទដ្ឋានគតិយុត្ត</NavLink></li>
            </ul> */}
            <Divider />
            <h3>ទំនាក់ទំនង</h3>
            <div style={{margin:10,paddingTop:0}}>
            <p style={paragraphStyle}>អាសយដ្ឋាន:មហាវិថីឈ្នះឈ្នះ ភូមិកប់ស្រូវ <br/>សង្កាត់គោករកា​ ខណ្ឌព្រែកព្នៅ រាជធានីភ្នំពេញ</p>
            <p>ទូរស័ព្ទ: (+855) 87 781 119</p>
            <p>អ៊ីម៉ែល: tsnh.hospital@gmail.com</p>

            </div>
            
  
           </div>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <div title="Social Media">
            <h3 style={fontColor}>ហ្វេសប៊ុកផ្លូវការមន្ទីរពេទ្យជាតិ តេជោសន្តិភាព</h3>
            <Divider />
            <Iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftsnhhospital&tabs=timeline&width=600&height=250&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
              width="100%"
              height="250px" // Consistent height for iframes
              frameBorder="0"
              style={{ border: 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <Divider />
          </div>
        </Col>
      </Row>
      <Divider />
      <h4 style={{color:"#343293"}}>© ២០២៤, រក្សាសិទ្ធិគ្រប់យ៉ាងដោយមន្ទីរពេទ្យជាតិ តេជោសន្តិភាព</h4> 
    </div>
  );
};

export default FooterPageView;
