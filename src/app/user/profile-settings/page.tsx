'use client'

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

function page() {

  const [userData, setUserData] = useState();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/user`, {
          withCredentials: true
        });

        //console.log(res.data);
        setUserData(res.data.found);
        setEmail(res.data.found.email);
        setName(res.data.found.name);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  const updateName = async () => {
    if (!name) {
      toast.error("Empty name not allowed");
      return;
    }

    let id = toast.loading("Updating . . . ");
    try {
      const res = await axios.put(`/api/user?=update`, {
        name, email
      }, { withCredentials: true });

      //console.log(res);
      if (res.status === 201) {
        toast.dismiss(id);
        toast.success("Profile Updated");
        setTimeout(() => {
          router.push('/user/home');
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

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Empty fields not allowed");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password length must be 8 or more");
      return;
    }

    let id = toast.loading("Changing . . . ");
    try {
      const res = await axios.put(`/api/user?=password`, {
        currentPassword, email, newPassword
      }, { withCredentials: true });

      //console.log(res);
      if (res.status === 201) {
        toast.dismiss(id);
        toast.success("Password changed");
        setTimeout(() => {
          router.push('/user/home');
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

  return (
    <>
      <div className={`w-full h-screen flex flex-col justify-start pt-28 items-center overflow-hidden relative`}>
        <Link href='/user/home' className={`absolute top-10 left-5 cursor-pointer text-sm md:text-xl lg:text-2xl`}><IoIosArrowBack /></Link>

        <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-black top-7 px-6 py-2`}>COMPANION AI</p>

        <h1 className={`w-[85%] md:w-[60%] lg:w-[40%] rounded-full py-2 border-b-2 border-black flex justify-center items-center text-center text-2xl sm:text-3xl lg:mt-5 md:text-4xl  font-Montserrat font-semibold`}>Profile Settings</h1>

        <form className={`mt-10 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] h-auto flex flex-col justify-center items-center gap-3 py-3 px-2`}>
          <p className={`w-full cursor-not-allowed py-2 px-3 rounded-m bg-gray-200 text-zinc-500 flex justify-start items-center gap-4 rounded-md`}>{email} <span className={`text-emerald-600 flex justify-center items-center gap-2`}>Verified <MdOutlineVerifiedUser title="Email Verified" className={`text-emerald-600`} /></span></p>
          <input onChange={(e) => setName(e.target.value)} type="text" className={`w-full rounded-md py-2 px-3 bg-gray-200 outline-none`} value={name} placeholder="Enter name" />
          <p className={`w-full py-2 text-center font-Montserrat bg-blue-500 text-white cursor-pointer hover:opacity-80 ease-in-out duration-200 rounded-md`} onClick={updateName}>Update</p>
        </form>

        <form className={`mt-5 relative w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] h-auto flex flex-col justify-center items-center gap-3 py-3 px-2`}>
          <span onClick={() => setVisible(!visible)} className={`absolute opacity-40 cursor-pointer right-5 top-[15%]`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
          <input onChange={(e) => setCurrentPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full rounded-md py-2 px-3 bg-gray-200 outline-none`} placeholder="Enter current password" />
          <span onClick={() => setVisible(!visible)} className={`absolute opacity-40 cursor-pointer right-5 top-[45%]`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
          <input onChange={(e) => setNewPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full rounded-md py-2 px-3 bg-gray-200 outline-none`} placeholder="Enter new password" />
          <p className={`w-full py-2 text-center font-Montserrat bg-blue-500 text-white cursor-pointer hover:opacity-80 ease-in-out duration-200 rounded-md`}>Change Password</p>
        </form>
      </div>
    </>
  )
}

export default page
