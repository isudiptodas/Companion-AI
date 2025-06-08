'use client'

import { Suspense, useEffect, useState } from 'react';
import { models } from '@/data/ai-model';
import { IoSearchSharp } from "react-icons/io5";
import { BiSolidSortAlt } from "react-icons/bi";
import { FaUserLarge } from "react-icons/fa6";
import { BsSoundwave } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';

interface sendData {
    id: Number,
    name: String,
    gender: String,
    desc: String,
    image: String,
    context: String,
    start: String,
    voice: String
};

interface userDataType {
    name: String,
    email: String
};

function page() {

    const [menuVisible, setMenuVisible] = useState(false);
    const [option, setOption] = useState('male');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState(models);
    const[userData, setUserData] = useState<userDataType | null>(null);
    const router = useRouter();

    useEffect(() => {
        const selected = models.filter((model) => {
            return model.gender === option
        });

        setFiltered(selected);
    }, [option]);

    const redirect = (data: sendData) => {
        const encodedData = encodeURIComponent(JSON.stringify(data));
        router.push(`/user/talk/${data.name}?encodedData=${encodedData}`);
    };

    useEffect(()=> {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/user`, {
                    withCredentials: true
                });

                //console.log(res.data);
                setUserData(res.data.found);
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);

    const logout = async () => {
        try {
            const res = await axios.post(`/api/user`, {}, {
                withCredentials: true
            });

            if(res.status === 201){
                setMenuVisible(false);
                router.push('/');
            }
        } catch (err: any) {
            if(err.response && err.response.data){
                toast.error(err.response.data);
            }
            else{
                toast.error("Something went wrong");
            }
        }
    }

    const search = (text: string) => {
        if(!searchTerm){
            toast.error("Please enter a voice to search");
            return;
        }
        const found = models.find((model) => {
            return model.name.includes(text.toLowerCase())
        });

        setFiltered(found ? [found] : []);
        //console.log(found);
    }

    return (
        <>
            <Suspense fallback={<div className={`w-full h-screen flex justify-center items-center`}>
                <img src='/assets/loading.gif' className='w-full h-full object-cover' />
            </div>}>

                <div className={`w-full min-h-screen bg-white flex flex-col justify-start items-center relative overflow-hidden`}>
                    <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-black top-7 px-6 py-2`}>COMPANION AI</p>
                    <p className={`text-lg lg:text-2xl absolute px-3 py-3 rounded-full top-7 right-5 md:right-7 bg-gradient-to-r from-purple-400 via-purple-600 to-pink-500 text-white cursor-pointer`} onClick={() => setMenuVisible(!menuVisible)}><FaUserLarge /></p>

                    <div className={`${menuVisible ? "block" : "hidden"} bg-white z-30 w-auto h-auto absolute pt-3 pb-1 px-2 rounded-md lg:rounded-lg shadow-lg top-20 right-5`}>
                        <p className={`text-black font-Montserrat text-[10px] md:text-lg text-center font-bold`}>{userData?.name}</p>
                        <hr className='w-full h-[0.5px] bg-gray-400 my-3 opacity-50' />
                        <Link href='/user/profile-settings' className={`text-black font-Montserrat text-[10px] md:text-lg text-start py-2 w-full px-3 hover:bg-gray-200 duration-200 ease-in-out cursor-pointer rounded-md`}>Profile Settings</Link>
                        <p className={`text-red-500 font-Montserrat text-[10px] md:text-lg text-start py-2 w-full px-3 hover:bg-red-200 duration-200 ease-in-out rounded-md cursor-pointer`} onClick={logout}>Logout</p>
                    </div>

                    <div className={`w-[90%] mt-24 sm:w-[80%] relative z-20 md:w-[70%] lg:w-[60%] h-auto flex flex-col lg:flex-row justify-between items-center gap-3`}>
                        <div className={`w-full flex justify-center items-center relative`}>
                            <input onChange={(e) => setSearchTerm(e.target.value)} type="text" className={`w-full px-3 py-3 rounded-full outline-none bg-gray-200 pr-10`} placeholder='Search any voice' />
                            <span className={`absolute top-2 p-2 rounded-full border-[1px] border-black cursor-pointer right-3`} onClick={() => search(searchTerm)}><IoSearchSharp /></span>
                        </div>
                        <p onClick={() => setOption(option === 'male' ? "female" : "male")} className={`w-full lg:w-[30%] bg-black capitalize cursor-pointer hover:opacity-80 ease-in-out duration-200 text-white py-3 rounded-full text-center flex justify-center items-center gap-2`}>{option} <BiSolidSortAlt /></p>
                    </div>

                    <h1 className={`w-[85%] md:w-[60%] lg:w-[40%] rounded-full py-2 border-b-2 border-black mt-7 text-center text-2xl sm:text-3xl md:mt-10 md:text-4xl font-Montserrat font-semibold`}>Available Voices</h1>

                    <div className={`w-full mb-10 px-5 mt-10 sm:w-[70%] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-5`}>
                        {filtered.length > 0 && filtered.map((model) => {
                            return <div key={model.id} className={`w-full rounded-md lg:rounded-lg px-3 pt-1 pb-5 h-auto flex flex-col justify-between items-center gap-2 bg-white shadow-2xl`}>
                                <div className={`w-full h-64 md:h-72 rounded-md lg:rounded-lg overflow-hidden`}>
                                    <img src={model.image} className={`h-full w-full object-cover lg:object-top rounded-md lg:rounded-lg`} />
                                </div>
                                <p className={`w-full px-2 border-b-[0.5px] border-gray-200 text-start font-Montserrat text-lg lg:text-2xl capitalize`}>{model.name}</p>
                                <p className={`w-full px-2 text-start font-Montserrat text-sm lg:text-lg`}>{model.desc}</p>
                                <p className={`w-[90%] text-center flex justify-center items-center gap-2 rounded-full py-2 bg-blue-500 text-white text-sm cursor-pointer hover:opacity-75 duration-200 ease-in-out lg:text-lg`} onClick={() => redirect(model)}>Talk <BsSoundwave /></p>
                            </div>
                        })}
                    </div>
                </div>
            </Suspense>
        </>
    )
}

export default page
