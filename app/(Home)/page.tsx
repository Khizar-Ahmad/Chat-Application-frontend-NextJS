"use client";

import { Footer } from "../components/footer";
import Navbar from "../components/header";
import { Hero } from "./main-section-landing-page";
import { useAppContext } from "../context-provider/context_Provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  // const [userInfo,updateUserInfo] = useState({token:'',name:'',email:''});
  const router = useRouter();
  const { userInfo, setUserInfo,setAllUsersMessages,setLastMessageToAllUsers } = useAppContext();

  const RetainData = async(user_id:any) =>{
    const getAllUsers = await axios.get(
        // `http://127.0.0.1:8000/api/users/${response?.data?.user?.id}`,
        `${process.env.NEXT_PUBLIC_BASE_URL}users/${user_id}`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
      );
       let lastMessagesHashmap: any = {};
      if (getAllUsers.data) {
        Object.entries(getAllUsers.data).forEach(([key, value]: any) => {
          // console.log(key);
          // console.log(value);
          console.log(value);
          lastMessagesHashmap[`${key}`] = value["message"];
        });
      }
      setLastMessageToAllUsers(lastMessagesHashmap);
      setAllUsersMessages(getAllUsers.data);  
  }
  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    console.log(token, email, name);
    if (token && name && email) {
      setUserInfo({ id: Number(id), name, email, token });
      RetainData(id)
      router.push("/main_page");
    }
  }, []);

  return (
    <>
      <header>
        {/* <nav className=""></nav> */}
        <Navbar />
      </header>
      <section>
        <article>
          {/* <div> This is the Home page</div> */}
          <Hero />
        </article>
      </section>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
