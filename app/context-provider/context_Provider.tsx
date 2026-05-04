"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  requestNotificationPermission,
  subscribeToForegroundMessages,
} from "./notificationhandlers";
interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}
interface UserDetails {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface receiver {
  id: number;
  name: string;
  email: string;
  connection_status: string;
}
export interface receiverData {
  id: number;
  caption: string;
  sender: number;
  receiver: number;
  seen_flag: boolean;
}
export interface receiverDetails {
  userInfo: receiver;
  data: receiverData[] | [];
}
export interface allUsersDetails {
  [userId: number]: receiverDetails;
}

type AppContextType = {
  //   user: string | null;
  //   setUser: (name: string | null) => void;
  signup: (data: SignupPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  getAllReceiverDetails: (data: any) => Promise<void>;
  sigupModalFlag: boolean;
  setSigupModalFlag: (val: boolean) => void;
  loginModalFlag: boolean;
  logOut: () => void;
  setLoginModalFlag: (val: boolean) => void;
  userInfo: UserDetails;
  setUserInfo: React.Dispatch<React.SetStateAction<UserDetails>>;
  receiverInfo: receiverDetails;
  setReceiverInfo: React.Dispatch<React.SetStateAction<receiverDetails>>;
  allUsersMessages: allUsersDetails;
  setAllUsersMessages: React.Dispatch<React.SetStateAction<allUsersDetails>>;
  // users: [receiverDetails] | [];
  // setUsers: (val: [receiverDetails] | []) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // const [users, setUsers] = useState<[receiverDetails] | []>([]);
  const [sigupModalFlag, setSigupModalFlag] = useState(false);
  const [loginModalFlag, setLoginModalFlag] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: 0,
    token: "",
    name: "",
    email: "",
  });
  const [receiverInfo, setReceiverInfo] = useState<receiverDetails>({
    userInfo: {
      id: 0,
      email: "",
      name: "",
      connection_status: "",
    },
    data: [],
  });
  const [allUsersMessages, setAllUsersMessages] = useState<any>({});
  const router = useRouter();

  const signup = async (payload: SignupPayload) => {
    console.log(payload);
    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/users/signup",
        `${process.env.NEXT_PUBLIC_BASE_URL}users/signup`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/signup",
        payload,
      );

      console.log("✅ Success:", response.data);
      setSigupModalFlag(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const login = async (payload: LoginPayload) => {
    console.log(payload);
    const token = await requestNotificationPermission();
    console.log(token, " This is the token");
    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/users/login",
        `${process.env.NEXT_PUBLIC_BASE_URL}users/login`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/login",
        payload,
      );
      const getAllUsers = await axios.get(
        // `http://127.0.0.1:8000/api/users/${response?.data?.user?.id}`,
        `${process.env.NEXT_PUBLIC_BASE_URL}users/${response?.data?.user?.id}`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
      );

      const resp = await axios.post(
        // `http://127.0.0.1:8000/api/notifications/register-device`,
        `${process.env.NEXT_PUBLIC_BASE_URL}notifications/register-device`,
        {
          userId: Number(response?.data?.user?.id),
          device_id: token,
          device_type: "web",
        },
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
      );
      //  const resp = await fetch(
      //     "http://127.0.0.1:8000/api/notifications/register-device",
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         userId: Number(response?.data?.user?.id),
      //         device_id: token,
      //         device_type: "web",
      //       }),
      //     }
      //   );
      console.log("✅ Success:", response.data);
      setLoginModalFlag(false);
      console.log("These are the users: ", getAllUsers);
      // setUsers(getAllUsers.data);
      setAllUsersMessages(getAllUsers.data);
      localStorage.setItem("id", response?.data?.user?.id);
      localStorage.setItem("token", response?.data?.user?.token);
      localStorage.setItem("email", response?.data?.user?.email);
      localStorage.setItem("name", response?.data?.user?.name);
      setUserInfo({
        id: response?.data?.user?.id,
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
        token: response?.data?.token,
      });
      router.push("/main_page");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const logOut = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("email", "");
    localStorage.setItem("name", "");
    localStorage.setItem("id", "0");

    setUserInfo({ id: 0, name: "", email: "", token: "" });
    setReceiverInfo({
      userInfo: {
        id: 0,
        email: "",
        name: "",
        connection_status: "",
      },
      data: [],
    });
    setAllUsersMessages({});
    router.push("/");
  };

  const getAllReceiverDetails = async (receId: any) => {
    const getReceiverInfo = await axios.get(
      // `http://127.0.0.1:8000/api/messages/${userInfo.id}/${receId}`,
      `${process.env.NEXT_PUBLIC_BASE_URL}messages/${userInfo.id}/${receId}`,
      // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
    );
    let idsOfUnseenMessages: any = [];

    getReceiverInfo?.data?.data.forEach((item: any) => {
      if (item.seen_flag == false && userInfo.id == item.receiver) {
        idsOfUnseenMessages.push(item.id);
      }
    });
    console.log("Ids of Unseen Messages: ", idsOfUnseenMessages);
    const payload = idsOfUnseenMessages;
    const resOfMessagesStatusUpdate = await axios.patch(
      // `http://127.0.0.1:8000/api/messages/unseen`,
      `${process.env.NEXT_PUBLIC_BASE_URL}messages/unseen`,
      payload,
      // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
    );
    console.log("success:", getReceiverInfo.data);
    setReceiverInfo(getReceiverInfo.data);
    setAllUsersMessages((prev: any) => {
      return {
        ...prev,
        [receId]: {
          ...prev[receId],
          data: [],
        },
      };
    });
    console.log("These are the users: ", getReceiverInfo);
  };

  return (
    <AppContext.Provider
      value={{
        login,
        signup,
        sigupModalFlag,
        setSigupModalFlag,
        loginModalFlag,
        setLoginModalFlag,
        userInfo,
        setUserInfo,
        receiverInfo,
        setReceiverInfo,
        allUsersMessages,
        setAllUsersMessages,
        // users,
        // setUsers,
        logOut,
        getAllReceiverDetails,
      }}
    >
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
