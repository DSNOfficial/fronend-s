// import React from 'react';
// import { Outlet} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { IoLanguageOutline, IoNewspaperOutline } from "react-icons/io5";
import { IoMdContact } from "react-icons/io";
import { FcAbout } from "react-icons/fc";
import { Layout, Menu, Drawer, Button, BackTop, Spin } from 'antd';
import { HomeOutlined, MenuOutlined, ArrowUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import FooterPageView from '../../view/component/FooterPageView';
import Logo from '../assets/image/logo.png';
import SlideShowPageView from '../../view/component/SlideShowPageView';
import SocialPageHeaderView from '../../view/component/SocialPageHeaderView';
import './logoanimation.module.css';
import './marquee.css';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;



const BodyLayoutView = () => {
  return (
    <div>
        
  
       <div><Outlet /></div>

      
    </div>
  )
}

export default BodyLayoutView


