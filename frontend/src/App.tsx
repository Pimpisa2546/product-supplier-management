import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductTable from "./page/ProductTable";
import SupplierPage from "./page/Supplier";
import Login from "./page/login";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductTable />}></Route>
          <Route path="/suppliers" element={<SupplierPage />}></Route>
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};
export default App;