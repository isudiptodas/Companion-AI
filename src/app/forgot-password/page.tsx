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
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [enteredOTP, setEnteredOTP] = useState('');
    const [otpVisible, setOtpVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [visible, setVisible] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const router = useRouter();

    const findEmail = async () => {
        if (!email) {
            toast.error("Enter email to find");
            return;
        }

        let id = toast.loading("Finding . . .");
        const otp = Math.floor(Math.random() * 900000) + 100000;
        setGeneratedOTP(otp.toString());

        try {
            const res = await axios.post(`/api/password-recovery`, {
                email, otp
            }, { withCredentials: true });

            //console.log(res);
            if (res.status === 200) {
                toast.dismiss(id);
                toast.success("Recovery mail sent");
                setOtpVisible(true);
            }
        } catch (err: any) {
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

    const changePassword = async () => {
        if (!password || !confirm) {
            toast.error("Empty fields not allowed");
            return;
        }

        if(password !== confirm){
            toast.error("Passwords do not match");
            return;
        }

        if(password.length < 8){
            toast.error("Password length must be 8 or more");
            return;
        }

        let id = toast.loading("Changing . . .");

        try {
            const res = await axios.put(`/api/password-recovery`, {
                password, email
            }, { withCredentials: true });

            //console.log(res);
            if (res.status === 201) {
                toast.dismiss(id);
                toast.success("Password changed");
                setTimeout(()=> {
                    router.push('/auth')
                }, 1500);
            }
        } catch (err: any) {
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

    const verifyOTP = () => {
        if(!enteredOTP){
            toast.error("Please enter OTP");
            return;
        }

        if(enteredOTP !== generatedOTP){
            toast.error("Invalid OTP");
            return;
        }

        toast.success("OTP verified");
        setOtpVerified(true);
    }

    return (
        <>
            <div className={`w-full px-10 h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#fff1e0]`}>

                <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-black top-7 px-6 py-2`}>COMPANION AI</p>

                <Link href='/auth' className={`absolute top-10 left-5 cursor-pointer text-sm md:text-lg lg:text-xl`}><IoIosArrowBack /></Link>

                <h1 className={`w-full text-center text-3xl sm:text-4xl md:text-5xl font-Kingsmen`}>Password Recovery</h1>
                <p className={`w-full font-Kingsmen text-center text-sm sm:text-lg md:text-xl`}>Don't worry ! We will help you recover your account</p>

                <form className={`w-full ${otpVisible ? "hidden" :"block"} sm:w-[70%] md:w-[60%] lg:w-[40%] relative px-2 shadow-lg py-3 flex flex-col justify-center items-center gap-3 rounded-md lg:rounded-xl border-[1px] border-white mt-5`}>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter email" />
                    <p className={`w-full text-center py-2 rounded-md cursor-pointer text-white hover:opacity-70 duration-200 ease-in-out font-Kingsmen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700`} onClick={findEmail}>Find Account</p>
                </form>

                <form className={`w-full ${otpVisible ? "block" :"hidden"} ${otpVerified ? "hidden" : "block"} sm:w-[70%] md:w-[60%] lg:w-[40%] relative px-2 shadow-lg py-3 flex flex-col justify-center items-center gap-3 rounded-md lg:rounded-xl border-[1px] border-white mt-5`}>
                    <input onChange={(e) => setEnteredOTP(e.target.value)} type="text" className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter otp" />
                    <p className={`w-full text-center py-2 rounded-md cursor-pointer text-white hover:opacity-70 duration-200 ease-in-out font-Kingsmen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700`} onClick={verifyOTP}>Verify OTP</p>
                </form>

                <form className={`w-full ${otpVerified ? "block" :"hidden"} sm:w-[70%] md:w-[60%] lg:w-[40%] relative px-2 shadow-lg py-3 flex flex-col justify-center items-center gap-3 rounded-md lg:rounded-xl border-[1px] border-white mt-5`}>
                    <div className={`w-full relative flex flex-col justify-center items-center gap-3`}>
                        <span onClick={() => setVisible(!visible)} className={`absolute opacity-45 cursor-pointer right-5 top-[30%]`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        <input onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Enter new password" />
                    </div>
                    <div className={`w-full relative flex flex-col justify-center items-center gap-3`}>
                        <span onClick={() => setVisible(!visible)} className={`absolute opacity-45 cursor-pointer right-5 top-[30%]`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        <input onChange={(e) => setConfirm(e.target.value)} type={visible ? "text" : "password"} className={`w-full bg-white rounded-md outline-none px-3 py-2`} placeholder="Confirm new password" />
                    </div>
                    <p className={`w-full text-center py-2 rounded-md cursor-pointer text-white hover:opacity-70 duration-200 ease-in-out font-Kingsmen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700`} onClick={changePassword}>Change Password</p>
                </form>

            </div>
        </>
    )
}

export default page
