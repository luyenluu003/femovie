// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice";

// const Navbar = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const handleLogout = () => {
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//         dispatch(logout());
//         navigate("/login");
//     };

//     return (
//         <div className="w-full flex justify-between items-center p-4 sm:p-6">
//             <img
//                 src="https://anhcute.net/wp-content/uploads/2024/11/anh-anime.jpg"
//                 alt=""
//                 className="w-28 sm:w-32 rounded-full"
//             />
//             <div className="flex items-center gap-2">

    
//                 <button
//                     onClick={handleLogout}
//                     className="border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
//                 >
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Navbar;

