import { useState } from "react";
import { request } from "../config/request";
import Logo from "../component/assets/image/logo.png";
import Bg1 from "../component/assets/image/1b.gif";
import {
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Spin,
  Alert,
  Space,
} from 'antd';
import {
  UserOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import {
  setAccessToken,
  setRefreshToken,
  setRoleMenu,
  setUser,
} from "../config/helper";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

//   const onLogin = async () => {
//     setError("");
//     if (!username || !password) {
//       setError("សូមបំពេញឈ្មោះគណនី និង លេខសម្ងាត់");
//       return;
//     }

//     setLoading(true);
//     const data = {
//       Username: username,
//       Password: password,
//     };

//     try {
//       const res = await request("user/login", "post", data);
//      if (res?.status === 429 || res?.error) {
//   // Show rate limiter message or error message
//   setError(res.message || "⛔ អ្នកត្រូវបានផ្អាកបណ្តោះអាសន្ន។ សូមព្យាយាមបន្តិចក្រោយ។");
// } else if (res) {
//         setUser(res.user);
//         setRoleMenu(res.permission_menu);
//         setAccessToken(res.access_token);
//         setRefreshToken(res.refesh_token);
//         navigate("/home");
//       } else {
//         setError("មានបញ្ហាក្នុងការភ្ជាប់ប្រព័ន្ធ។");
//       }
//     } catch {
//       setError("បរាជ័យក្នុងការភ្ជាប់!");
//     } finally {
//       setLoading(false);
//     }
//   };

const onLogin = async () => {
  setError("");
  if (!username || !password) {
    setError("សូមបំពេញឈ្មោះគណនី និង លេខសម្ងាត់");
    return;
  }

  setLoading(true);
  const data = {
    Username: username,
    Password: password,
  };

  try {
    const res = await request("user/login", "post", data);

    // ✅ Handle rate limit or general error
    if (res?.status === 429 || res?.error) {
      setError(res.message || "⛔ អ្នកត្រូវបានផ្អាកបណ្តោះអាសន្ន។ សូមព្យាយាមបន្តិចក្រោយ។");
    } else if (res) {
      setUser(res.user);
      setRoleMenu(res.permission_menu);
      setAccessToken(res.access_token);
      setRefreshToken(res.refesh_token);
      navigate("/home");
    } else {
      setError("មានបញ្ហាក្នុងការភ្ជាប់ប្រព័ន្ធ។");
    }
  } catch {
    setError("បរាជ័យក្នុងការភ្ជាប់!");
  } finally {
    setLoading(false);
  }
};
  
return (
    <div style={styles.container}>
      <div style={{ ...styles.background, backgroundImage: `url(${Bg1})` }} />

      {loading && <div style={styles.blurOverlay} />}

      <div style={styles.formWrapper}>
        <Form layout="vertical" name="loginForm" autoComplete="off">
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: 250, objectFit: "contain", borderRadius: 24 }}
            />
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16, fontFamily: "KhmerOSSiemReap" }}
            />
          )}

          <Form.Item
            label="ឈ្មោះគណនី"
            name="username"
            style={{ fontSize: "13px" ,fontFamily: "KhmerOSSiemReap"}}
            rules={[{ required: true, message: 'សូមបំពេញឈ្មោះគណនី!' }]}
          >
            <Input
              size="large"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ឈ្មោះគណនី"
            style={{ fontSize: "13px" }}

              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="លេខសម្ងាត់"
            name="password"
            style={{ fontSize: "13px",fontFamily: "KhmerOSSiemReap" }}

            rules={[{ required: true, message: 'សូមបំពេញលេខសម្ងាត់!' }]}
          >
            <Input.Password
              size="large"
              onChange={(e) => setPassword(e.target.value)}
              prefix={<KeyOutlined />}
              style={{ fontSize: "13px",fontFamily: "KhmerOSSiemReap" }}

              placeholder="លេខសម្ងាត់"
            />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                onClick={onLogin}
                type="primary"
                htmlType="submit"
                size="large"
                block
                disabled={loading}
                style={{ fontFamily: "KhmerOSSiemReap" , fontSize: "13px" }}
              >
                ចូលប្រើប្រាស់
              </Button>

              <Button
                type="default"
                size="large"
                block
                disabled={loading}
                style={{ fontFamily: "KhmerOSSiemReap"  ,fontSize: "13px"  }}
              >
                ចុះឈ្មោះប្រើប្រាស់ប្រព័ន្ធ
              </Button>
            </Space>
          </Form.Item>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Typography.Text style={{ fontFamily: "KhmerOSSiemReap" ,fontSize: "12px"}}>
              © ២០២៤ រក្សាសិទ្ធិដោយ ការិយាល័យរដ្ឋបាល និងបុគ្គលិក
            </Typography.Text>
          </div>
        </Form>
      </div>

      {loading && (
        <div style={styles.loadingSpinner}>
          <Spin size="large" tip="កំពុងចូល..." />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "KhmerOSSiemReap",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    zIndex: 0,
    filter: "brightness(0.6)", // darker for form readability
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 3,
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  formWrapper: {
    position: "relative",
    zIndex: 4,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
   padding: 28, // ⬅️ smaller padding
  borderRadius: 14, // ⬅️ slightly smaller radius
  width: 340,        // ⬅️ smaller width
    maxWidth: "90%",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
  },
  loadingSpinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 5,
    transform: "translate(-50%, -50%)",
  },
};

export default LoginPage;
