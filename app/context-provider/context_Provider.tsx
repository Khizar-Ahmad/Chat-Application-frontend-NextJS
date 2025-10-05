"use client"; 

import { createContext, useContext, useState, ReactNode } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";


interface SignupPayload {
    name: string,
    email:string,
    password: string
}

interface LoginPayload {
    email:string,
    password:string
}
interface UserDetails{
  name:string,
  email:string,
  token:string
}
type AppContextType = {
//   user: string | null;
//   setUser: (name: string | null) => void;
  signup: (data: SignupPayload) => Promise<void>; 
  login: (data: LoginPayload) => Promise<void>; 
  sigupModalFlag: boolean,
setSigupModalFlag: (val:boolean) => void 
loginModalFlag:boolean,
setLoginModalFlag:(val:boolean) => void ,
userInfo:UserDetails
setUserInfo:(val:UserDetails) => void ,

};


const AppContext = createContext<AppContextType | null>(null);


export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState("Guest");
const [sigupModalFlag,setSigupModalFlag]= useState(false);
const [loginModalFlag,setLoginModalFlag]= useState(false);
const [userInfo,setUserInfo] = useState({token:'',name:'',email:''});
const router = useRouter();

  const signup = async(payload:SignupPayload) =>{
        console.log(payload);
           try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/signup", payload);
      console.log("✅ Success:", response.data);
      setSigupModalFlag(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }

  }

    const login = async(payload:LoginPayload) =>{
        console.log(payload);
        try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login", payload);
      console.log("✅ Success:", response.data);
      setLoginModalFlag(false);
      localStorage.setItem('token',response?.data?.token);
      localStorage.setItem('email',response?.data?.user?.email);
      localStorage.setItem('name',response?.data?.user?.name);
      setUserInfo({name:response?.data?.user?.name,email:response?.data?.user?.email,token:response?.data?.token})
      router.push('/main_page');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  }

  return (
    <AppContext.Provider value={{login,signup,sigupModalFlag,setSigupModalFlag,loginModalFlag,setLoginModalFlag,userInfo,setUserInfo }}>
      {children}
    </AppContext.Provider>
  );
}


export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within <AppProvider>");
  }
  return ctx;
}




