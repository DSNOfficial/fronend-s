import React, { useEffect, useState } from "react";
import { Config } from "../../config/helper";
import { message,Row,Col } from 'antd';
import { request } from "../../config/request";
import './MarqueePageView.css';
import logo1 from "../../component/assets/image/logs.png"


const MarqueePageView = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoading(true);
        try {
            const res = await request("tbmarquee/getList", "get");
            if (res && res.list && res.list.length > 0) {
                const lastItem = res.list[res.list.length - 1];
                setList([lastItem]);
            }
        } catch (error) {
            message.error("Failed to fetch the list");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem({ ...item }); // Clone the item to avoid direct mutation
    };

    const handleSave = async () => {
        if (!editingItem) return;
        setLoading(true);
        try {
            // Make a request to update the item
            await request(`tbmarquee/update/${editingItem.id}`, "post", editingItem);
            // Update the local state
            setList(list.map(item => item.id === editingItem.id ? editingItem : item));
            setEditingItem(null);
            message.success("Item updated successfully");
        } catch (error) {
            message.error("Failed to update the item");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setEditingItem({ ...editingItem, description: e.target.value });
    };
    const KhmerOSSiemReap =  {
        fontFamily: 'KhmerOSSiemReap',
        // color:"#343293",
      };

    return (
        <div className="marquee-container">
                <div style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     paddingBottom: 5,
                     margin:-18,
                     marginTop:-10 ,
                     backgroundColor:"#343293"
                      }}>

              
            {list.map((item, index) => (
                   
              <marquee key={index} className="marquee">
           
            <Row>
                {/* <Col span={1}>
                {item.Image && (
                  <img
                      src={`${Config.image_path}${item.Image}`}
                      style={{ width: "60%" }}
                      alt="Marquee Image"
                      className="marquee-image"
                  />
              )}
                </Col> */}
                <Col span={2}>
                {/* <p style={{color:"#FFFFFF"}} className="KhmerOSSiemReap">
                {item.description}


                </p> */}


<p
      style={{
        color: "#FFFFFF",
        display: "inline-block",
         padding: "0 2rem",
        // fontSize: "2rem",
        background: `url(${logo1}) no-repeat left top 2px`,
         backgroundSize: "20px",
      }}
      className="KhmerOSSiemReap"
    >
      {item.description}
    </p>
                                {/* <p
                    style={{
                        color: "#FFFFFF",
                        display: "inline-block",
                        padding: "0 2rem", // Fixed padding syntax
                        fontSize: "2rem",
                        background: "url(logo1) no-repeat left top 10px", // Background shorthand
                        backgroundSize: "20px", // Size of the background image
                    }}
                    className="KhmerOSSiemReap"
                    >
                    {item.description}
                    </p> */}
                </Col>
            </Row> 
           <div  className="marquee-text">      

              </div>
                   
                  
                </marquee>
              
                
            ))}
              </div>
            {editingItem && (
                <div className="edit-container">
                    <input
                        type="text"
                        value={editingItem.description}
                        onChange={handleChange}
                    />
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </div>
    );
};

export default MarqueePageView;
