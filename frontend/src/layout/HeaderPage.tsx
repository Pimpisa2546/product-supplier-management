import {theme, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import UserDropdown from "./UserDrop";
import { useLocation } from "react-router-dom";

const { Title } = Typography;
export const HeaderPage: React.FC = () => {
    const location = useLocation();

    const pageTitle = {
        "/products": "Product Management",
        "/suppliers": "Supplier Management"
    }
    const path = location.pathname as keyof typeof pageTitle;
    const currentPage = pageTitle[path] || "Home";

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return(
          <Header style={{
            padding: '0 24px',
            height: 64,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px #00000014',
            position: "sticky",
            top: 0,
            zIndex: 10
          }}>
            <Title level={4} 
                style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                   {currentPage}
            </Title>
            <UserDropdown/>
          </Header>
    );
};
export default HeaderPage;