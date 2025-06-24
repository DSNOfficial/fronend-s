import React, { useState, useEffect } from 'react';
import './ContentPageView.css';
import { Divider, Layout, Tabs,Spin } from 'antd';
import Modal from 'react-modal';
// import ImageShowPageView from './ImageShowPageView';
import { RightOutlined } from '@ant-design/icons';
import './CustomTabs.css';
import TourDates from './TourDates';
import { request } from "../../config/request";
import SlideShowPageView from './SlideShowPageView';
import MarqueePageView from './MarqueePageView';
import BlogPageView from './BlogPageView';
import ErrorPageView from './ErrorPageView';
import InstructurePageView from './InstructurePageView';
import GoogleTranslatePage from './GoogleTranslatePage';
import ImageShowTestViewPage from './ImageShowTestViewPage';
import ImageShowPageView from './ImageShowPageView';
import ImageShowWithNewsView from './ImageShowWithNewsView';

const { Content } = Layout;

const containerStyle = {
  padding: '20px',
  paddingBottom:'25px',
  margin: '0 auto',
  maxWidth: '1279px',
 // maxWidth:'100%',
  backgroundColor: 'white',
  marginTop: '-65px',
};

const HomePageView = () => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [numTabs, setNumTabs] = useState(2); // Initial number of tabs

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const Marquee = ({ text }) => (
    <div className="marquee">
      <div className="marquee-content">
        <span>{text}</span>
      </div>
    </div>
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };


  }, []);

  useEffect(() => {
    // Update the number of tabs
    setNumTabs(2); // Assuming there are 2 tabs initially, you can change this dynamically
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);
    const res = await request("department/getlist", "get");
    setLoading(false);
    if (res) {
      setList(res.list);
    }
  };

  return (
    <div>

   

      <SlideShowPageView />
 
      <MarqueePageView />

     
      <div style={containerStyle}>
        <br />



        {/* <Tabs
          defaultActiveKey="1"
          className="custom-tabs"
          items={[
            {
              label: (
                <span style={{ color: numTabs > 2 ? 'var(--tab-color2)' : 'var(--tab-color1)' }}>
                  អំពីយើង <RightOutlined />
                </span>
              ),
              key: '1',
              // dataIndex:item.Description ,
              children: ''

            },
          ]}
        /> */}
  
        {/* <ImageShowPageView/> */}
       {/* <ImageShowTestViewPage/> */}
       <ImageShowWithNewsView/>
        <br/>
        <Tabs
          defaultActiveKey="1"
          className="custom-tabs"
          items={[
            {
              label: (
                <span style={{ color: numTabs > 2 ? 'var(--tab-color2)' : 'var(--tab-color1)' }}>
                  ផ្នែកផ្តល់សេវាព្យាបាល <RightOutlined />
                </span>
              ),
              key: '1',
              // children: 'Content of Tab 2',
            },
          ]}
        />
       
           <BlogPageView/>

   

        
      <Tabs
          defaultActiveKey="1"
          className="custom-tabs"
          items={[
            {
              label: (
                <span style={{ color: numTabs > 2 ? 'var(--tab-color2)' : 'var(--tab-color1)' }}>
                  រចនាសម្ព័ន្ធ <RightOutlined />
                </span>
              ),
              key: '1',
              
            },
          ]}
        />
        <div style={containerStyle}>
        <InstructurePageView/>
        <useGtagPageView/>
        
        </div>
        <br/>
        <div style={{
          backgroundColor:"#343293",
          paddingBottom:8 ,
          margin:-20         
          }}>
        </div>
    

      </div>
      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={{
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: 0,
            border: 'none',
            background: 'none',
            overflow: 'hidden',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <img
            src="http://localhost:81/tsnh/image6/image-1714726406961-672226926"
            alt="Get a Fire Extinguisher FREE"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
      </Modal> */}
    </div>
  );
};

export default HomePageView;
