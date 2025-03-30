import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const AutoLogout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        dispatch(logout());
      }
    };

    const interval = setInterval(checkToken, 5 * 60 * 1000); // Kiểm tra mỗi 5 phút
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default AutoLogout;
