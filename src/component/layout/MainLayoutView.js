import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import Flag from 'react-flagkit';
// import { IoLanguageOutline } from "react-icons/io5";
import { Layout, Menu, Drawer, Button, FloatButton, Spin, Grid } from 'antd';
import { HomeOutlined, MenuOutlined, ArrowUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import FooterPageView from '../../view/component/FooterPageView';
import Logo from '../assets/image/logo.png';
import SocialPageHeaderView from '../../view/component/SocialPageHeaderView';
import './logoanimation.module.css';
import './MainLayoutView.css';
// import { BiFontFamily } from 'react-icons/bi';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const translations = {
  en: {
    home: "Home",
    office: "Offices",
    mainOffice: " Offices",
    history: "history",
    news : "news ",
    admin: "Administration",
    accounting: "Finance",
    technical: "Technical",
    subOffice: "Sub Office",
    subOfficeAdmin: "Sub Office Admin",
    subOfficeAccounting: "Sub Office Accounting",
    aboutUs: "About​ Hospital",
    news: "News",
    doc: "Announcement",
    mission: "Mission",
    moreAboutUs: "More About Us",
    vision: "Vision",
    values: "Values",
    department: "Departments",
    training: "Training",
    partners: "Partners",
    contact: "Contact",
    changeLanguage: "Languages",
    khmer: "ខ្មែរ",
    english: "English",
    
    paitientIn: "patient-In",
    paitientOut: "patient-Out",
    packageH: "Package Hospital",
    structure : "Structure",
    // valueH: "Value",
    vision: "Vision",
   
  },
  kh: {
    home: "ទំព័រដើម",
    office: "ការិយាល័យ",
    mainOffice: "ការិយាល័យ", 
    history: "ប្រវត្តិមន្ទីរពេទ្យ",
    admin: "ការិ.រដ្ឋបាល ​និងបុគ្គលិក",
    accounting: "ការិ.ហិរញ្ញវត្ថុ",
    technical: "ការិ.បច្ចេកទេស",
    subOffice: "Sub Office",
    subOfficeAdmin: "Sub Office Admin",
    subOfficeAccounting: "Sub Office Accounting",
    aboutUs: "អំពីមន្ទីរពេទ្យ",
    doc: "ច្បាប់ និងបទដ្ឋានគតិយុត្ត",
    mission: "បេសកកម្ម",
    moreAboutUs: "More About Us",
    vision: "Vision",
    // values: "Values",
    department: "សេវាព្យាបាល",
    training: "ការបណ្តុះបណ្តាល",
    partners: "ដៃគូសហការ",
    contact: "ទំនាក់ទំនង",
    changeLanguage: "ប្តូរភាសា",
    khmer: "ខ្មែរ",
    english: "English",

    paitientOut: "សេវាពិគ្រោះជំងឺក្រៅ",
    paitientIn: "សេវាព្យាបាលសម្រាកពេទ្យ",
    packageH: "កញ្ចប់សេវាព្យាបាល",
    structure: "រចនាសម្ព័ន្ធ",
    valueH: "គុណតម្លៃ",
    vision: "ទស្សនៈវិស័យ",
    news: "ព័ត៌មានទូទៅ",
   
  }
};

const MainLayoutView = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'kh');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();

  const isMobile = screens.xs;
  const isTablet = screens.md;
  const isDesktop = screens.lg || screens.xl || screens.xxl;

  const handleLanguageChange = (lang) => {
    setLoading(true);
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setTimeout(() => setLoading(false), 500); // Adjust delay as needed
  };

  useEffect(() => {
    const handleResize = () => {
      setIsAnimating(false);
    };

    const debouncedHandleResize = debounce(handleResize, 100);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };
  
  const handleMenuClick = (key) => {
    setLoading(true);
    setTimeout(() => {
      navigate(key);
      setLoading(false);
      if (isMobile) {
        setDrawerVisible(false);
      }
    }, 500); // Adjust delay as needed
  };

  const handleLogoInteraction = (isStart) => {
    setIsAnimating(isStart);
  };

  const containerStyle = {
    padding: '20px',
    margin: '0 auto',
    maxWidth: '1200px',
    marginTop: '-25px',
    fontFamily: 'KhmerOSSiemReap, sans-serif' // Apply here
  };

  const KhmerOSSiemReap =  {
    fontFamily: 'KhmerOSSiemReap',
    color:'#343293',
  };
  const colorFont={
    color:'#343293',
  }


  const t = translations[language];

  return (
    <Layout  style={{ 
      minHeight: '100vh',
      fontSize: '14px',
      display: 'flex', 
      flexDirection: 'column' ,
      }}>
      <SocialPageHeaderView />
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          backgroundColor: '#FFFFFF',
          color:"#343293",
          flexShrink: 0,
          fontFamily: 'KhmerOSSiemReap' // Apply here
          
        }}
      >
            <div className="logo">
          <NavLink to="/">
           
              <img
                src={Logo} alt="Logo" style={{ width: isMobile ? 150 : 250, marginTop: 10 }}
                className={isAnimating ? "logo-image animated" : "logo-image"}
                onMouseDown={() => handleLogoInteraction(true)}
                onMouseUp={() => handleLogoInteraction(false)}
                onTouchStart={() => handleLogoInteraction(true)}
                onTouchEnd={() => handleLogoInteraction(false)}
              />
      
          </NavLink>
        </div >
        {(isDesktop || isTablet) && (
          <Menu
     
          
            theme="light"
            mode="horizontal"
            triggerSubMenuAction="hover" // Updated to hover
            defaultSelectedKeys={['home']}
            style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', fontFamily: 'KhmerOSSiemReap' }}
          >
            <Menu.Item key="home" style={colorFont} onClick={() => handleMenuClick('/')}>
              <HomeOutlined /> {t.home}
            </Menu.Item>
        
            <SubMenu
           
              key="about-us"
              title={<span style={colorFont}>{t.aboutUs}<CaretDownOutlined /></span>}
              popupClassName="custom-submenu-popup"
              triggerSubMenuAction="hover" // Updated to hover
            >
              <Menu.ItemGroup >
                <Menu.Item key="history" style={colorFont} onClick={() => handleMenuClick('/page/history')}>
                  {t.history}
                </Menu.Item>
                <Menu.Item  key="structure" style={colorFont} onClick={() => handleMenuClick('/page/structure')}>
                  {t.structure}
                </Menu.Item>
                <Menu.Item key="administration" style={colorFont} onClick={() => handleMenuClick('/page/administration')}>
                  {t.admin}
                </Menu.Item>
                <Menu.Item key="account" style={colorFont} onClick={() => handleMenuClick('/page/account')}>
                  {t.accounting}
                </Menu.Item>
                <Menu.Item key="technical"style={colorFont}  onClick={() => handleMenuClick('/page/technical')}>
                  {t.technical}
                </Menu.Item>
                <Menu.Item key="doc" style={colorFont} onClick={() => handleMenuClick('/page/books')}>
                  {t.doc}
                </Menu.Item>
                <Menu.Item key="vision"style={colorFont}  onClick={() => handleMenuClick('/page/vision/2')}>
                  {t.vision}
                </Menu.Item>
                <Menu.Item key="mission"style={colorFont} onClick={() => handleMenuClick('/page/mission/1')}>
                  {t.mission}
                </Menu.Item>
                {/* <Menu.Item key="valueH" style={colorFont} onClick={() => handleMenuClick('/page/value/1')}>
                  {t.valueH}
                </Menu.Item> */}
              </Menu.ItemGroup>
            </SubMenu>

        
            <SubMenu
              key="paitient"
              title={<span style={colorFont}>{t.department}<CaretDownOutlined /></span>}
              popupClassName="custom-submenu-popup"
              triggerSubMenuAction="hover" // Updated to hover
            >
                     <Menu.Item key="paitientOut" style={colorFont} onClick={() => handleMenuClick('/page/patient-out')}>
                {t.paitientOut}
              </Menu.Item>
              <Menu.Item key="paitientIn"style={colorFont} onClick={() => handleMenuClick('/page/patient-in')}>
                {t.paitientIn}
              </Menu.Item>
       
              <Menu.Item key="packageH" style={colorFont} onClick={() => handleMenuClick('/page/package-patient')}>
                {t.packageH}
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="department"
              title={<span style={colorFont}>{t.news}<CaretDownOutlined /></span>}
              popupClassName="custom-submenu-popup"
              triggerSubMenuAction="hover" // Updated to hover
            >
              <Menu.Item key="training" style={colorFont} onClick={() => handleMenuClick('/page/trainers')}>
                {t.training}
              </Menu.Item>     
            </SubMenu>
            <Menu.Item key="partners" style={colorFont} onClick={() => handleMenuClick('/page/partners')}>
                {t.partners}
              </Menu.Item>
            <Menu.Item key="contact" style={colorFont} onClick={() => handleMenuClick('/page/contact')}>
              {t.contact}
            </Menu.Item>
        
          </Menu>
        )}
        {isMobile && (
          <Button
            type="text"
         
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            style={{ color: 'black' }}
          />
        )}
      </Header>

      <Drawer
  title={<img src={Logo} alt="Logo" style={{ width: 150 }} />}
  placement="right"
  closable={false}
  onClose={toggleDrawer}
  visible={drawerVisible}
  open={drawerVisible}
  // Replace bodyStyle with styles.body
  styles={{
    body: {
      padding: 0,
      fontFamily: 'KhmerOSSiemReap',
    },
  }}
>
  <Menu
    theme="light"
    mode="inline"
    defaultSelectedKeys={['home']}
    style={{ height: '100%', borderRight: 0 }}
    onClick={({ key }) => handleMenuClick(key)}
  >
    {/* Menu items */}
    <Menu
          theme="light"
          // mode="vertical"
             mode="inline"
          defaultSelectedKeys={['home']}
          style={{ height: '100%', borderRight: 0 }}
          onClick={({ key }) => handleMenuClick(key)}
        >
         
         <Menu.Item key="" onClick={() => handleMenuClick('/')}>
              <HomeOutlined /> {t.home}
            </Menu.Item>
        
            <SubMenu
              key="about-us"
              title={<span>{t.aboutUs}</span>}
              popupClassName="custom-submenu-popup"
              triggerSubMenuAction="hover" // Updated to hover
            >
              <Menu.ItemGroup>
                <Menu.Item key="/page/history" onClick={() => handleMenuClick('/page/history')}>
                  {t.history}
                </Menu.Item>
                <Menu.Item key="/page/structure" onClick={() => handleMenuClick('/page/structure')}>
                  {t.structure}
                </Menu.Item>
                <Menu.Item key="/page/administration" onClick={() => handleMenuClick('/page/administration')}>
                  {t.admin}
                </Menu.Item>
                <Menu.Item key="/page/account" onClick={() => handleMenuClick('/page/account')}>
                  {t.accounting}
                </Menu.Item>
                <Menu.Item key="/page/technical" onClick={() => handleMenuClick('/page/technical')}>
                  {t.technical}
                </Menu.Item>
                <Menu.Item key="/page/books" onClick={() => handleMenuClick('/page/books')}>
                  {t.doc}
                </Menu.Item>
                <Menu.Item key="/page/vision/2" onClick={() => handleMenuClick('/page/vision/2')}>
                  {t.vision}
                </Menu.Item>
                <Menu.Item key="/page/mission/1" onClick={() => handleMenuClick('/page/mission/1')}>
                  {t.mission}
                </Menu.Item>
                {/* <Menu.Item key="/page/value/1" onClick={() => handleMenuClick('/page/value/1')}>
                  {t.valueH}
                </Menu.Item> */}
              </Menu.ItemGroup>
            </SubMenu>

        
            <SubMenu
              key="paitient"
              title={<span>{t.department}</span>}
              popupClassName="custom-submenu-popup"
              triggerSubMenuAction="hover" // Updated to hover
            >
                     <Menu.Item key="/page/patient-out" onClick={() => handleMenuClick('/page/patient-out')}>
                {t.paitientOut}
              </Menu.Item>
              <Menu.Item key="/page/patient-in" onClick={() => handleMenuClick('/page/patient-in')}>
                {t.paitientIn}
              </Menu.Item>
       
              <Menu.Item key="/page/package-patient" onClick={() => handleMenuClick('/page/package-patient')}>
                {t.packageH}
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="department"
              title={<span>{t.news}</span>}
              popupClassName="custom-submenu-popup"
              triggerSubMenuAction="hover" // Updated to hover
            >
              <Menu.Item key="/page/trainers" onClick={() => handleMenuClick('/page/trainers')}>
                {t.training}
              </Menu.Item>     
            </SubMenu>
            <Menu.Item key="/page/partners" onClick={() => handleMenuClick('/page/partners')}>
                {t.partners}
              </Menu.Item>
            <Menu.Item key="/page/contact" onClick={() => handleMenuClick('/page/contact')}>
              {t.contact}
            </Menu.Item>
        </Menu>
  </Menu>
      </Drawer>


      {/* <Drawer
        placement="right"
        closable={false}
        onClose={toggleDrawer}
        open={drawerVisible}
        bodyStyle={{
          padding: 0,
          fontFamily: 'KhmerOSSiemReap',
        }}
      >
      
      </Drawer> */}

      {/* <Spin spinning={loading} tip="Loading..."> */}
      <Spin spinning={loading} tip="ប្រព័ន្ធកំពុងដំណើរការ... សូមរងចាំ">

        {/* <Content style={containerStyle}> */}
        <Content style={{ flex: '1 0 auto' ,  fontFamily: 'KhmerOSSiemReap'}}>

          <Outlet />
        </Content>
      </Spin>

      <Footer style={{ flexShrink: 0 ,paddingInline:"revert"}}>
        <FooterPageView />
      </Footer>

  			<FloatButton.BackTop 
  type="primary"
  shape="circle"
  icon={<ArrowUpOutlined />} 
  size="large"
/>
    </Layout>
  );
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export default MainLayoutView;
