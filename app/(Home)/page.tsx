"use client"; 

import { Footer } from "../components/footer";
import Navbar from "../components/header";
import { Hero } from "./main-section-landing-page";
import { useAppContext } from "../context-provider/context_Provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home(){
    // const [userInfo,updateUserInfo] = useState({token:'',name:'',email:''});
    const router= useRouter();
    const {userInfo,setUserInfo} = useAppContext();
      useEffect(()=>{

        const token = localStorage.getItem('token');
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        console.log(token,email,name);
        if(token && name && email){
          setUserInfo({name,email,token})
          router.push('/main_page')
        }


      },[])
        
    return(
    
        <>
          <header>
            {/* <nav className=""></nav> */}
            <Navbar/>
      </header>
      <section>
         <article>
            {/* <div> This is the Home page</div> */}
          <Hero/>
               
           </article>
      </section>
      <footer>
      <Footer/>
      </footer>
        </>
    );
}