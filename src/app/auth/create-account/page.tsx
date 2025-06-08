'use client'

import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function page() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirm, setConfirm] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [enteredOTP, setEnteredOTP] = useState('');
    const [visible, setVisible] = useState(false);
    const [otpVisible, setOtpVisible] = useState(false);
    const router = useRouter();

    const createAccount = async () => {

        if(enteredOTP !== generatedOTP){
            toast.error("Invalid OTP");
            return;
        }

        let id;

        try {
            id = toast.loading("Creating your account . . .");
            const res = await axios.post(`/api/auth?=register`, {
                name, password, email
            });
            console.log(res);
             if(res.status === 200){
                toast.dismiss(id);
                toast.success("User Registered");
                setTimeout(()=> {
                    router.push('/auth');
                }, 1500);
            }
        } catch (err: any) {
            if (err.response && err.response.data) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
            //console.log(err);
        }
        finally {
            toast.dismiss(id);
        }
    }

    const requestOTP = async () => {
        if (!name || !email || !password || !confirm) {
            toast.error("All fields are required");
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length <= 8) {
            toast.error("Password must be 8 characters or more");
            return;
        }

        let id;
        const otp = Math.floor(Math.random() * 900000) + 100000;
        setGeneratedOTP(otp.toString());

        try {
            id = toast.loading("Sending OTP . . .");
            const res = await axios.post(`/api/auth?=otp`, {
                name, email, otp
            });
            console.log(res);
             if(res.status === 200){
                toast.dismiss(id);
                toast.success("OTP sent on mail");
                setOtpVisible(true);
            }
        } catch (err: any) {
            if (err.response && err.response.data) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
            //console.log(err);
        }
        finally {
            toast.dismiss(id);
        }
    }

    return (
        <>
            <div className={`w-full px-10 h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#fff1e0]`}>

                <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-black top-7 px-6 py-2`}>COMPANION AI</p>

                <Link href='/auth' className={`absolute top-10 left-5 cursor-pointer text-sm md:text-lg lg:text-xl`}><IoIosArrowBack /></Link>

                <h1 className={`w-full text-center text-3xl sm:text-4xl md:text-5xl font-Kingsmen`}>Create a new account</h1>
                <p className={`w-full font-Kingsmen text-center text-sm sm:text-lg md:text-xl`}>We can't wait to see you use our AI voices</p>

                <form className={`${otpVisible ? "hidden" : "block"} w-full sm:w-[70%] md:w-[60%] lg:w-[40%] relative px-2 shadow-lg py-3 flex flex-col justify-center items-center gap-3 rounded-md lg:rounded-xl border-[1px] border-white mt-5`}>
                    <input onChange={(e) => setName(e.target.value)} type="text" className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter full name" />
                    <input onChange={(e) => setEmail(e.target.value)} type="email" className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter email" />
                    <div className={`w-full relative flex flex-col justify-center items-center gap-3`}>
                        <span onClick={() => setVisible(!visible)} className={`absolute opacity-45 cursor-pointer right-5 top-[30%]`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        <input onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter password" />
                    </div>
                    <div className={`w-full relative flex flex-col justify-center items-center gap-3`}>
                        <span onClick={() => setVisible(!visible)} className={`absolute opacity-45 cursor-pointer right-5 top-[30%]`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        <input onChange={(e) => setConfirm(e.target.value)} type={visible ? "text" : "password"} className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Confirm password" />
                    </div>
                    <p className={`w-full text-center py-2 rounded-md cursor-pointer text-white hover:opacity-70 duration-200 ease-in-out font-Kingsmen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700`} onClick={requestOTP}>Request OTP</p>
                </form>

                <form className={`${otpVisible ? "block" : "hidden"} w-full sm:w-[70%] md:w-[60%] lg:w-[40%] relative px-2 shadow-lg py-3 flex flex-col justify-center items-center gap-3 rounded-md lg:rounded-xl border-[1px] border-white mt-5`}>
                    <input onChange={(e) => setEnteredOTP(e.target.value)} type="text" className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter OTP" />
                   
                    <p className={`w-full text-center py-2 rounded-md cursor-pointer text-white hover:opacity-70 duration-200 ease-in-out font-Kingsmen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700`} onClick={createAccount}>Verify OTP</p>
                </form>

                <Link href='/auth' className={`w-full text-center mt-5 font-Kingsmen cursor-pointer`}>Already have an account</Link>
            </div>
        </>
    )
}

export default page
