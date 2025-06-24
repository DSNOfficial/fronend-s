import React from 'react';
import { Tabs } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './CustomTabs.css'; // Custom CSS file for additional styles

const { TabPane } = Tabs;

const CustomTabs = () => {
    return (
        <div className="custom-tabs-container">
            <div className="title font-strong">
                <a href="#">
                    វីដេអូ <RightOutlined />
                    <div className="corner"></div>
                </a>
            </div>
            {/* <Tabs className="home-tabs hot-new">
                <TabPane tab="Tab 1" key="1">
                    Content of Tab Pane 1
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                    Content of Tab Pane 2
                </TabPane>
                <TabPane tab="Tab 3" key="3">
                    Content of Tab Pane 3
                </TabPane>
            </Tabs> */}
        </div>
    );
};

export default CustomTabs;
