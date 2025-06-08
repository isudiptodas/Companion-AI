'use client'

import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { Accordion, AccordionItem } from '@heroui/accordion';
import { faq } from '@/data/accordian';

function page() {

  const models = [
    {
      id: 1,
      name: 'alex',
      photo: '/assets/models/Alex.jpg'
    },
    {
      id: 2,
      name: 'hayden',
      photo: '/assets/models/Isabella.jpg'
    },
    {
      id: 3,
      name: 'justin',
      photo: '/assets/models/Justin.jpg'
    },
    {
      id: 4,
      name: 'sofi',
      photo: '/assets/models/Sofi.jpg'
    },
  ];

  return (

    <>
      <div className={`w-full min-h-screen flex flex-col justify-start items-center overflow-hidden`}>

        {/* hero section */}
        <div className={`w-full h-screen rounded-b-4xl bg-[#fff1e0] relative flex flex-col justify-center items-center overflow-hidden`}>

          <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-black top-7 px-6 py-2`}>COMPANION AI</p>

          <div className={`motion-preset-shrink motion-duration-2000 w-40 lg:w-72 h-40 bg-gradient-to-l from-green-300 via-green-500 to-emerald-700 rounded-full blur-[120px] absolute bottom-11 right-10`}></div>
          <div className={`motion-preset-shrink motion-duration-2000 w-24 h-24 bg-gradient-to-l from-blue-300 via-blue-500 to-indigo-700 rounded-full blur-3xl absolute bottom-24 -right-5`}></div>

          <div className={`motion-preset-shrink motion-duration-2000 w-72 h-72 lg:w-[400px] bg-gradient-to-l from-green-300 via-green-500 to-emerald-700 rounded-full blur-[120px] absolute -top-10 -left-3 lg:left-24 lg:-top-20`}></div>
          <div className={`motion-preset-shrink motion-duration-2000 w-24 h-24 bg-gradient-to-l from-blue-300 via-blue-500 to-indigo-700 rounded-full blur-3xl absolute top-24 -right-10`}></div>

          <p className={`text-2xl sm:text-4xl lg:text-6xl text-center font-Kingsmen motion-preset-slide-right motion-duration-2000`}>Talk with your <span className={`font-bold bg-gradient-to-br from-purple-400 via-pink-500 to-pink-800 bg-clip-text text-transparent`}>AI</span> companion</p>
          <p className={`mb-5 lg:mb-10 sm:text-4xl text-center text-2xl lg:text-6xl font-Kingsmen motion-preset-slide-left motion-duration-2000`}>Anytime... Anywhere</p>
          <Link href='/auth' className={`w-auto flex justify-center hover:opacity-80 duration-200 ease-in-out items-center gap-3 rounded-full bg-blue-500 text-white font-Montserrat px-4 py-1 lg:py-2 cursor-pointer motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[1s] motion-duration-[1s]/scale motion-duration-[1s]/translate motion-duration-[1s]/rotate`}>Try Companion AI <FaLocationArrow className="font-bold text-sm" /></Link>
        </div>

        {/* model demo section */}
        <div className={`w-full h-auto px-4 flex flex-col justify-start items-center pb-10`}>
          <p className={`text-xl sm:text-2xl md:text-4xl font-Kingsmen py-5 lg:py-6 mb-5 mt-3`}>Conversations that lift your mood </p>

          <div className={`w-full mb-5 grid grid-cols-2 md:grid-cols-4 justify-items-center gap-3`}>
            {models.map((model) => {
              return <div key={model.id} className={` w-full pt-1 px-1 h-60 lg:h-96 rounded-md lg:rounded-lg xl:rounded-xl overflow-hidden relative`}>
                <img src={model.photo} className="w-full z-20 h-full object-cover lg:object-top rounded-md lg:rounded-lg xl:rounded-xl" />
                <div className={`w-full absolute bottom-2 flex flex-col justify-center items-center gap-2`}>
                  <p className=" rounded-md w-[80%] backdrop-blur-3xl bg-white/15 text-white text-center font-Montserrat text-[12px] py-2 capitalize">{model.name}</p>
                  <Link href='/user/home' className={`w-[80%] py-2 cursor-pointer hover:opacity-75 ease-in-out duration-200 flex justify-center items-center gap-2 text-center bg-white text-black rounded-md`}>Talk <IoIosCall /></Link>
                </div>
              </div>
            })}
          </div>

          <p className={`text-lg font-Kingsmen lg:text-2xl`}>And many more . . .</p>
        </div>


        <div className={`w-full flex justify-center items-center pb-5 px-4`}>
          <p className={`text-[10px] md:text-[14px] w-[90%] md:w-[70%] lg:w-[50%] font-Kingsmen text-center`}>Everyone needs a companion to talk, to listen, to share feelings. But in nowadays its not possible for everyone
            to get in touch everytime, on every high and lows. For that reason here is our Companion AI with whon you can talk, share your feelings
          </p>
        </div>

        <hr className={`w-[95%] md:w-[70%] lg:w-[60%] h-[1px] bg-zinc-400`}/>
        <p className={`text-xl sm:text-2xl md:text-4xl font-Kingsmen py-5 lg:py-6 mb-5 mt-3`}>All Doubts Cleared </p>

        <div className={`w-[90%] sm:w-[80%] md:w-[60%] lg:w-[30%] flex flex-col justify-center items-center`}>
          <Accordion showDivider={true} variant="shadow" fullWidth={true}>
            {faq.map((list) => {
              return <AccordionItem className="mb-3 text-sm md:text-lg lg:text-xl" key={list.id} title={list.title}>
                  {list.desc}
              </AccordionItem>
            })}
          </Accordion>
        </div>

        <div className={`w-full h-20`}></div>


      </div>
    </>
  )
}

export default page
