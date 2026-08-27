import { Form, Input, Button, Alert, message } from "antd";
import { useState } from "react";
import { Login } from "../services/AllService";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const startSessionTime = (token:string) => {
  try{
    const decoded: JwtPayload = jwtDecode(token);
    const timeLeft = decoded.exp * 1000 - Date.now();
    if (timeLeft > 0) {
        setTimeout(() => {
          localStorage.clear();
          message.error("Session expired. Please log in again.");
          window.location.href = "/";
        }, timeLeft);
      }
  } catch (err) {
      console.error("Failed to decode token", err);
  }
};

  const handleLogin = async (values: any) => {
    setError("");
    setLoading(true);

    try {
      const data = await Login(values);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      startSessionTime(data.token);
      message.success("Login Success");
      navigate("/products");
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      const errorMessage =
        axiosError.response?.data?.error || "Login Failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center", 
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Form
        onFinish={handleLogin}
        layout="vertical"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#ffffff",
          padding: "24px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
          {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}