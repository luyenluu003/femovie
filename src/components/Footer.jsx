import React from "react";
import RootLayout from "../layout/RootLayout";
import { Link } from "react-router-dom";
import { MdLanguage, MdLocationOn } from "react-icons/md";

const Footer = () => {
    return(
        <div className="w-full mt-10">
            <div className="w-full md:aspect-[16/4] aspect-auto bg-[url('./assets/footerbg.jpg')] bg-cover bg-no-repeat bg-center relative">
                <div className="w-full h-full bg-gradient-to-r from-green-500 via-green-500 to-green-500/10">
                    <RootLayout className={"w-full h-full flex items-start justify-center flex-col md:py-0 py-4"} >
                        <div className="md:w-[65%] w-full space-y-8">
                            <h1 className="md:text-6xl text-3xl text-neutral-50 font-thin !leading-[1.45]">
                                Gain access to unlimited <br />
                                TV shows, movies, and more.
                            </h1>

                            <div className="md:w-[70%] w-ful flex items-center gap-x-3 h-14">
                                <input type="email" placeholder="Enter your email" className="flex-1 bg-neutral-950/50 h-full px-4 border-2 
                                border-neutral-950/10 focus:border-neutral-900/50 text-base text-neutral-200 font-normal rounded-xl placeholder:text-neutral-500 
                                focus:outline-none" />

                                <button className="bg-neutral-950 hover:bg-transparent border-2 border-neutral-950 hover:border-neutral-950 md:px-8 px-4 w-fit h-full 
                                text-base text-neutral-50 font-normal rounded-xl ease-in-out duration-300">
                                    Get Started
                                </button>

                            </div>
                        </div>
                    </RootLayout>
                </div>
            </div>

            <div className="w-full py-16 bg-neutral-950">
                <RootLayout>
                    <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-10">
                        <div className="col-span-1 space-y-8">
                           <div className="space-y-8">
                                <Link to="/" className='text-2xl text-green-500 font-bold uppercase mr-16'>
                                    YuiChill
                                </Link>
                                <div className="flex items-center gap-x-1 text-sm text-neutral-500 font-normal">
                                    <MdLocationOn />
                                    <p className="">Yuichill VN</p>
                                </div>
                           </div>

                           <div className="flex items-center gap-x-1 bg-neutral-900 rounded-md w-fit px-3 py-2">
                                <MdLanguage />
                                <select name="" id="" className="text-base text-neutral-300 font-normal px-2 bg-neutral-900 rounded-md border-none focus:outline-none">
                                    <option value="vi">Việt Nam</option>
                                    <option value="en">English</option>
                                    <option value="jp">Japan</option>
                                </select>
                           </div>
                        </div>

                        <div className="col-span-1 space-y-4">
                            <h1 className="text-base text-neutral-400 font-normal uppercase">Explore</h1>

                            <ul className="list-none text-neutral-300 font-normal text-sm space-y-2.5 flex flex-col">
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Account
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Ways to watch
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Only on Yuichill
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="col-span-1 space-y-4">
                            <h1 className="text-base text-neutral-400 font-normal uppercase">Legal</h1>

                            <ul className="list-none text-neutral-300 font-normal text-sm space-y-2.5 flex flex-col">
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Cookies Preferences
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Terms of Use
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Gift Card Terms
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Legal Notices
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Coporate Information
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>

                        <div className="col-span-1 space-y-4">
                            <h1 className="text-base text-neutral-400 font-normal uppercase">Support</h1>

                            <ul className="list-none text-neutral-300 font-normal text-sm space-y-2.5 flex flex-col">
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Speed Test
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Media Center
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="underline hover:text-neutral-200">
                                        Investors Relations
                                    </Link>
                                </li>
                            </ul>
                        </div>


                    </div>
                </RootLayout>
            </div>

        </div>
    )
}

export default Footer