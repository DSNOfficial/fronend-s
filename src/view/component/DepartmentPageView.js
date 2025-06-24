import React, { useEffect, useState, useRef } from "react";
import { Config, isEmptyOrNull } from "../../config/helper";
import { request } from "../../config/request";
import { Card ,message} from 'antd';
const { Meta } = Card

const DepartmentPageView = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      getList();
  }, []);

  const getList = async () => {
      setLoading(true);
  
      try {
          const res = await request("tbmarquee/getList", "get");
          if (res && res.list && res.list.length > 0) {
              // Get the first item from the list
              const firstItem = res.list[0];
              setList([firstItem]); // Set only the first item in the list
          }
      } catch (error) {
          message.error("Failed to fetch the list");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div>
        <h2>Department here!! test </h2>
        {list.map((item, Image) => (
        <Card
    hoverable
    style={{
      width: 240,

    }}
    key={Image}
    cover={<img alt="example" src={Config.image_path + item.Image} />}
  >
   
  </Card>
        ))}
    </div>
  )
}

export default DepartmentPageView



