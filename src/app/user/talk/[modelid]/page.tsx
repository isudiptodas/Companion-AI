'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react"
import { FaUserLarge } from "react-icons/fa6";
import { toast } from 'sonner';
import Vapi from "@vapi-ai/web";
import { MdCallEnd } from "react-icons/md";
import axios from "axios";
import Link from "next/link";

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

function page() {

    const [menuVisible, setMenuVisible] = useState(false);
    const search = useSearchParams();
    const [allowed, setAllowed] = useState(false);
    const [modelData, setModelData] = useState<sendData | null>(null);
    const router = useRouter();
    const [message, setMessage] = useState('');
    const vapi = useRef<Vapi | null>(null);

    useEffect(() => {
        const encodedData = search.get('encodedData');
        if (encodedData) {
            const data = JSON.parse(decodeURIComponent(encodedData));
            setModelData(data);
            //console.log(data);
            setAllowed(true);
        }
        else {
            router.push('/user/home');
        }
    }, [search]);

    const logout = async () => {
        try {
            const res = await axios.post(`/api/user/logout`, {}, {
                withCredentials: true
            });

            if (res.status === 201) {
                setMenuVisible(false);
                router.push('/');
            }
        } catch (err: any) {
            if (err.response && err.response.data) {
                toast.error(err.response.data);
            }
            else {
                toast.error("Something went wrong");
            }
        }
    }

    useEffect(() => {
        vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);
    }, []);

    useEffect(() => {
        if(!modelData){
            return;
        }

        const options: {} = {
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },
            model: {
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `${modelData?.context}`,
                    },
                ],
            },
            voice: {
                provider: "playht",
                voiceId: `${modelData?.voice}`,
            },
            name: "Companion AI",
        }

        let id = toast.loading("Starting your call");
        vapi.current?.start(options);

        vapi.current?.on('call-start', () => {
            toast.dismiss(id);
            vapi.current?.say(modelData?.start as string);
        });

        vapi.current?.on('message', (message) => {
            if(message && message.type === 'transcript' && message.transcriptType === 'final'){
                //console.log(message.transcript);
                //setMessage(message.transcript);
            }
        });

        return () => {
            vapi.current?.stop();
            toast.dismiss(id);
        }
    }, [modelData]);

    const endCall = async () => {
        vapi.current?.stop();
        router.push('/user/home');
    }


    return (

        <>
            <Suspense fallback={<div className={`w-full h-screen flex justify-center items-center`}>
                <img src='/assets/loading.gif' className='w-full h-full object-cover' />
            </div>}>
                <div className={`${allowed ? "block" : "hidden"} w-full h-screen flex flex-col justify-start items-center relative overflow-hidden`}>
                    <p className={`z-30 absolute font-GONJURING text-xl md:text-2xl xl:text-3xl tracking-widest text-black top-7 px-6 py-2`}>COMPANION AI</p>
                    <p className={`text-sm lg:text-xl absolute px-3 py-3 rounded-full top-7 right-5 md:right-7 bg-gradient-to-r from-purple-400 via-purple-600 to-pink-500 text-white cursor-pointer`} onClick={() => setMenuVisible(!menuVisible)}><FaUserLarge /></p>

                    <div className={`${menuVisible ? "block" : "hidden"} bg-white z-30 w-auto h-auto absolute pt-3 pb-1 px-2 rounded-md lg:rounded-lg shadow-lg top-20 right-5`}>
                        <p className={`text-black font-Montserrat text-[10px] md:text-lg text-center font-bold`}>Sudipto Das</p>
                        <hr className='w-full h-[0.5px] bg-gray-400 my-3 opacity-50' />
                        <Link href='/user/profile-settings' className={`text-black font-Montserrat text-[10px] md:text-lg text-start py-2 w-full px-3 hover:bg-gray-200 duration-200 ease-in-out cursor-pointer rounded-md`}>Profile Settings</Link>
                        <p className={`text-red-500 font-Montserrat text-[10px] md:text-lg text-start py-2 w-full px-3 hover:bg-red-200 duration-200 ease-in-out rounded-md cursor-pointer`} onClick={logout}>Logout</p>
                    </div>

                    <div className={`w-[85%] mt-28 h-[60vh] md:w-[60%] lg:w-[40%] xl:w-[30%] relative overflow-hidden rounded-xl`}>
                        <img src={modelData?.image as string} className={`w-full h-full object-cover rounded-xl`} />
                    </div>
                    <h1 className={`mt-5 capitalize w-[80%] md:w-[60%] lg:w-[40%] border-b-[1.5px] border-gray-300 text-center text-2xl xl:text-4xl font-Kingsmen`}>{modelData?.name}</h1>
                    
                    <p className={`w-auto text-center px-5 py-2 rounded-full bg-red-500 flex justify-center items-center gap-3 cursor-pointer hover:bg-red-700 duration-200 ease-in-out mt-5 text-white`} onClick={endCall}>End Call <MdCallEnd /></p>
                </div>

                <div className={`${allowed ? "hidden" : "block"} w-full h-screen flex justify-center items-center bg-black`}>
                    <img src='/assets/loading.gif' className='w-full h-full object-cover' />
                </div>
            </Suspense>
        </>
    )
}

export default page
