import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={`/`} />;
};
export default PrivateRoutes;
