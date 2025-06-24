import React, { useState } from "react";
import { Input } from "antd";
import { SendOutlined, PaperClipOutlined } from "@ant-design/icons";

const AIPage = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      console.log("ផ្ញើសារ:", message);
      setMessage("");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <img src="/logo.svg" alt="Logo" style={styles.logo} />

        <h1 style={styles.heading}>សួស្តី ខ្ញុំឈ្មោះ៖ ធនញ្ជ័យ
  
        </h1>
        <p style={styles.subHeading}>តើខ្ញុំអាចជួយអ្នកបានដូចម្តេច?</p>

        <div style={styles.inputWrapper}>
          <Input
            placeholder="វាយសាររបស់អ្នកនៅទីនេះ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={handleSend}
            size="large"
            style={styles.input}
            suffix={
              <div style={styles.icons}>
                <PaperClipOutlined style={styles.icon} />
                <SendOutlined style={styles.icon} onClick={handleSend} />
              </div>
            }
          />
        </div>

        <div style={styles.buttons}>
          <button style={styles.chip}>🧠 គំនិតជ្រៅ (R1)</button>
          <button style={styles.chip}>🌐 ស្វែងរក</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "calc(100vh - 64px)", // Adjust if your header is not 64px tall
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    textAlign: "center",
    maxWidth: 700,
    width: "100%",
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  heading: {
    fontSize: "2rem",
    color: "#222",
    fontWeight: 600,
    fontFamily: "'Khmer OS', sans-serif",
    marginBottom: 8,
  },
  subHeading: {
    fontSize: "1rem",
    color: "#555",
    fontFamily: "'Khmer OS', sans-serif",
    marginBottom: 30,
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  input: {
    borderRadius: "20px",
    padding: "10px 16px",
    backgroundColor: "#f5f5f5",
    color: "#000",
    border: "1px solid #ccc",
    fontFamily: "'Khmer OS', sans-serif",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    fontSize: 18,
    color: "#666",
    cursor: "pointer",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#e6e6e6",
    color: "#000",
    border: "none",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontFamily: "'Khmer OS', sans-serif",
  },
};

export default AIPage;
