'use client'

import Link from "next/link"
import { FaLocationArrow } from "react-icons/fa";

function page() {
  return (
    <>
      <div className="w-full h-screen bg-black flex flex-col justify-start items-center pt-28">
        <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-white top-7 px-6 py-2`}>COMPANION AI</p>

        <p className={`w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] px-5 py-5 rounded-md lg:rounded-xl text-white font-Montserrat text-lg lg:text-xl lg:mt-10 text-center`}>It looks like you are not authenticated </p>
        <Link href='/auth' className="text-white bg-blue-500 rounded-full flex justify-center items-center gap-3 cursor-pointer px-5 py-2">Login <FaLocationArrow className="font-bold text-sm" /></Link>
      </div>
    </>
  )
}

export default page
