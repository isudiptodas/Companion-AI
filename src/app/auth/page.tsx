'use client'

import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

function page() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    const login = async () => {
        if (!email || !password) {
            toast.error("All fields are required");
            return;
        }

        let id;

        try {
            id = toast.loading("Logging you in . . .");
            const res = await axios.post(`/api/auth?=login`, {
                password, email
            });
            //console.log(res);

            if(res.status === 200){
                toast.dismiss(id);
                router.push('/user/home');
            }

        } catch (err: any) {
            //console.log(err);
            if (err.response && err.response.data) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
            toast.dismiss(id);
        }
        finally {
            toast.dismiss(id);
        }
    }

    return (
        <>
            <div className={`w-full px-10 h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#fff1e0]`}>

                <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-black top-7 px-6 py-2`}>COMPANION AI</p>

                <Link href='/' className={`absolute top-10 left-5 cursor-pointer text-sm md:text-lg lg:text-xl`}><IoIosArrowBack /></Link>

                <h1 className={`w-full text-center text-3xl sm:text-4xl md:text-5xl font-Kingsmen`}>Welcome Back</h1>
                <p className={`w-full font-Kingsmen text-center text-sm sm:text-lg md:text-xl`}>We are happy to see you again !</p>

                <form className={`w-full sm:w-[70%] md:w-[60%] lg:w-[40%] relative px-2 shadow-lg py-3 flex flex-col justify-center items-center gap-3 rounded-md lg:rounded-xl border-[1px] border-white mt-5`}>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter email" />
                    <span onClick={() => setVisible(!visible)} className={`absolute opacity-45 cursor-pointer right-5 top-[45%]`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                    <input onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter password" />
                    <p className={`w-full text-center py-2 rounded-md cursor-pointer text-white hover:opacity-70 duration-200 ease-in-out font-Kingsmen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700`} onClick={login}>Enter</p>
                </form>

                <Link href='/forgot-password' className={`w-full text-center mt-5 font-Kingsmen cursor-pointer`}>Forgot Password</Link>
                <Link href='/auth/create-account' className={`w-full text-center cursor-pointer font-Kingsmen`}>Create an account</Link>
            </div>
        </>
    )
}

export default page
