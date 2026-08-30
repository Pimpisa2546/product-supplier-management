import { Avatar, Grid, Dropdown, MenuProps, Space, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { useBreakpoint } = Grid;

export const UserDropdown: React.FC = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [,setLoading] = useState(false);

  const [userName,setUsername] = useState<string>("");

  useEffect(()=>{
    const userData = localStorage.getItem("user");
    if(userData){
      try{
        const parsedUser = JSON.parse(userData);
        if(parsedUser?.name){
          setUsername(parsedUser.name);
        }
      }catch(err){
        console.error("Failed to parse user data", err);
      }
    }
  },[]);

  const handleLogout = () => {
    try{
      setLoading(true);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      message.success("Logout Success");
      navigate("/");
    }catch(err){
      message.error("Logout Failed");
      console.error("Logout Failed: ",err);
    }finally{
      setLoading(false);
    };
    
  };
  
  const userMenuItems: MenuProps =
  {items: [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      disabled:true,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      disabled:true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      danger: true,
      label: 'Logout',
      icon: <LogoutOutlined />,
    },
  ],
  onClick:({key})=>{
      if(key === "logout"){
        handleLogout();
      }
    }
  };

  return (
    <Dropdown menu={userMenuItems} trigger={['click']} placement="bottomRight">
      <Space size="middle" style={{ cursor: 'pointer' }}>
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#949aa3' }} />
        {screens.sm && <Text strong>{userName}</Text>}
      </Space>
    </Dropdown>
  );
};

export default UserDropdown;