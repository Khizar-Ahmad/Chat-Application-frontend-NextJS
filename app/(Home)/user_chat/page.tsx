"use client";
import { Footer } from "./../../components/footer";
import HomeNavbar from "./../../components/HomeHeader";
import { Hero } from "./../main-section-landing-page";
import { useAppContext } from "./../../context-provider/context_Provider";
import MainSection from "./main_section";
import { useEffect } from "react";
import axios from "axios";
export default function LandingPage() {
  const {
    userInfo,
    setUserInfo,
    setAllUsersMessages,
    setLastMessageToAllUsers,
  } = useAppContext();

  const RetainData = async (user_id: any) => {
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
        if (value["message"] || value["file_type"] == null) {
          lastMessagesHashmap[`${key}`] = value["message"];
        } else {
          if (value["file_type"] == "IMAGE") {
            lastMessagesHashmap[`${key}`] = "Image...";
          } else {
            lastMessagesHashmap[`${key}`] = "Video...";
          }
        }
        // lastMessagesHashmap[`${key}`] = value["message"];
      });
    }
    setLastMessageToAllUsers(lastMessagesHashmap);
    setAllUsersMessages(getAllUsers.data);
  };
  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    console.log(token, email, name);
    if (token && name && email) {
      setUserInfo({ id: Number(id), name, email, token });
      RetainData(id);
    }
  }, []);
  return (
    <>
      <header>
        {/* <nav className=""></nav> */}
        <HomeNavbar />
      </header>
      <section className="h-[98vh] sm:h-[90vh]">
        <article className="h-full">
          {/* <div> This is the Home page</div> */}
          {/* <Hero/> */}
          <MainSection />
        </article>
      </section>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
}
