"use client"; 

import { Footer } from "./../../components/footer";
import Navbar from "./../../components/header";
import { Hero } from "./../main-section-landing-page";
import { useAppContext } from "./../../context-provider/context_Provider";
import SideBar from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function MainSection(){
    var client_id = Date.now();
    //  document.querySelector("#ws-id").textContent = client_id; 
    const router = useRouter();
    const {userInfo,setUserInfo} = useAppContext();
    // var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
    
          useEffect(()=>{
    
            const token = localStorage.getItem('token');
            const name = localStorage.getItem('name');
            const email = localStorage.getItem('email');
            console.log(token,email,name);
            if(!token && !name && !email){
              setUserInfo({name:'',email:'',token:''})
              router.push('/')
            }else{
                console.log(email);
    var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}/${email}`);

            }
    
    
          },[])
        
    return(
    
        <>
      <div className="flex h-full">
        
    <SideBar/>

       
        <div className="flex-1 flex flex-col">
       
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold" id="chatAvatar">AS</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900" id="chatName">Alice Smith</h2>
                        <p className="text-sm text-green-600">Online</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <i data-lucide="phone" className="w-5 h-5 text-gray-600"></i>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <i data-lucide="video" className="w-5 h-5 text-gray-600"></i>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <i data-lucide="info" className="w-5 h-5 text-gray-600"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide chat-pattern p-6" id="messagesContainer">
               
                <div className="flex justify-center mb-4">
                    <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-500 shadow-sm">Today</span>
                </div>

           
                <div className="flex items-start space-x-2 mb-4">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">AS</span>
                    </div>
                    <div className="message-bubble bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-gray-800">Hey! How's the project coming along?</p>
                        <span className="text-xs text-gray-500 mt-1 block">2:25 PM</span>
                    </div>
                </div>

                
                <div className="flex items-start space-x-2 mb-4 justify-end">
                    <div className="message-bubble bg-blue-500 text-white rounded-lg p-3 shadow-sm">
                        <p>It's going great! Almost finished with the main features.</p>
                        <span className="text-blue-100 text-xs mt-1 block text-right">2:26 PM</span>
                    </div>
                </div>

                
                <div className="flex items-start space-x-2 mb-4">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">AS</span>
                    </div>
                    <div className="message-bubble bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-gray-800">That sounds great! Let's do it 🚀</p>
                        <span className="text-xs text-gray-500 mt-1 block">2:30 PM</span>
                    </div>
                </div>

                <div className="flex items-start space-x-2 mb-4 justify-end">
                    <div className="message-bubble bg-blue-500 text-white rounded-lg p-3 shadow-sm">
                        <p>Perfect! I'll send you the details shortly.</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                            <span className="text-blue-100 text-xs">2:31 PM</span>
                            <i data-lucide="check-check" className="w-3 h-3 text-blue-200"></i>
                        </div>
                    </div>
                </div>
            </div>

           
            <div className="bg-white px-6 py-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <i data-lucide="paperclip" className="w-5 h-5 text-gray-500"></i>
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            id="messageInput"
                            placeholder="Type a message..." 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            // onkeypress="handleKeyPress(event)"
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <i data-lucide="smile" className="w-5 h-5 text-gray-500"></i>
                        </button>
                    </div>
                    <button 
                       
                        className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors shadow-lg"
                    >
                        <i data-lucide="send" className="w-5 h-5 text-white"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
    );
}