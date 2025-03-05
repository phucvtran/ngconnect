import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../redux/store";

/**
 * private route for authenticated user
 * @returns
 */
const PrivateRoutes = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.refreshToken
  );
  return isAuthenticated ? <Outlet /> : <Navigate to={`/`} />;
};
export default PrivateRoutes;
