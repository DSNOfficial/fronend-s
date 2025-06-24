import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import mystyles from "./TwoColPage.module.css";

const TwoColPageView = () => {
  const items = [...Array(8).keys()];

  return (
    <div>
  
       <hr/>
       <h6 className={mystyles.heading}>
     
        <span>ប្រភេទសេវាកម្ម</span>
      </h6>
      <Row gutter={[16, 16]}>
        {items.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <div className={mystyles.column}>
              <div className={mystyles.card}>
                <a href={`#link${index}`} target="_blank" rel="noopener noreferrer">
                  <motion.img
                    src="http://192.168.11.103:81/tsnh/image6/image-1714445061728-806533927"
                    alt="Jane"
                    initial={{ filter: "brightness(1)", scale: 1 }}
                    whileHover={{ filter: "brightness(0.8)", scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: "100%" }}
                  />
                </a>
                <div className={mystyles.item1}>
                  <h2>ផ្នែកសង្រ្គោះបន្ទាន់</h2>
                  <p className={mystyles.its}>CEO &amp; Founder</p>
                  <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                  <p>example@example.com</p>
                  <p><button className={mystyles.item}>Contact</button></p>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TwoColPageView;
