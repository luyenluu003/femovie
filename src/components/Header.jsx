import React from "react";
import { useSelector } from "react-redux";

const Header = () =>{

    const {user} = useSelector((state) => state.auth)

    console.log("user" , user)


    return (
        <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
            <img src="https://anhcute.net/wp-content/uploads/2024/11/anh-anime.jpg" alt="" className="w-36 h-36 rounded-full mb-6" />
            <h1 className="flex items-center gap-2 text-xl sm:text-3xl">Hey {user.userName}</h1>
        </div>
    )
}

export default Header