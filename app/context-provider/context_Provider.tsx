"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
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
  created_at: string;
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
  getAllReceiverDetails: (data: any, limit: any) => Promise<void>;
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
  wsRef: any;
  otpModalFlag: boolean;
  setOtpModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  onVerify: (data: string) => Promise<void>;
  onResend: () => Promise<void>;
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  toastMessage: any;
  setToastMessage: any;
  toastType: any;
  setToastType: any;
  forgotPasswordModalFlag: any;
  setForgotPasswordModalFlag: any;
  lastMessageToAllUsers: any;
  setLastMessageToAllUsers: any;
  resetPassword: (data: any) => Promise<void>;
  forgotPassword: (data: any) => Promise<void>;
  hasMore: boolean;
  setHasMore: (val: boolean) => void;
  // users: [receiverDetails] | [];
  // setUsers: (val: [receiverDetails] | []) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // const [users, setUsers] = useState<[receiverDetails] | []>([]);
  const [sigupModalFlag, setSigupModalFlag] = useState(false);
  const [loginModalFlag, setLoginModalFlag] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [otpModalFlag, setOtpModalFlag] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [forgotPasswordModalFlag, setForgotPasswordModalFlag] =
    useState<boolean>(false);
  const [lastMessageToAllUsers, setLastMessageToAllUsers] = useState<any>({});

  const [toastMessage, setToastMessage] = useState<string>("");

  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
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
  const [hasMore, setHasMore] = useState(true);
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
      localStorage.setItem("email", response.data.email);
      setShowToast(true);
      setToastType("success");
      setToastMessage(response.data.detail);
      setOtpModalFlag(true);
    } catch (error: any) {
      // if (axios.isAxiosError(error)) {
      //   console.error("Axios error:", error.response?.data || error.message);
      // } else {
      //   console.error("Unknown error:", error);
      // }
      console.log(error?.response?.data?.detail?.status);
      console.log(error?.response?.data?.detail?.message);
      setShowToast(true);
      setToastType(error?.response?.data?.detail?.status);
      setToastMessage(error?.response?.data?.detail?.message);
    }
  };

  const login = async (payload: LoginPayload) => {
    console.log(payload);
    const token = await requestNotificationPermission();
    console.log(token, " This is the token");
    let email = payload?.email;
    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/users/login",
        `${process.env.NEXT_PUBLIC_BASE_URL}users/login`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/login",
        payload,
      );
      console.log(response);

      const getAllUsers = await axios.get(
        // `http://127.0.0.1:8000/api/users/${response?.data?.user?.id}`,
        `${process.env.NEXT_PUBLIC_BASE_URL}users/${response?.data?.user?.id}`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
      );
      if (token) {
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
      }
      var client_id = Date.now();

      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}ws/${client_id}/${response?.data?.user?.email}`,
      );
      wsRef.current = ws;

      wsRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      console.log("✅ Success:", response.data);
      setLoginModalFlag(false);
      console.log("These are the users: ", getAllUsers);

      // setUsers(getAllUsers.data);
      let lastMessagesHashmap: any = {};
      if (getAllUsers.data) {
        Object.entries(getAllUsers.data).forEach(([key, value]: any) => {
          // console.log(key);
          // console.log(value);
          console.log(value);
          // lastMessagesHashmap[`${key}`] = value["message"];
          if (value["message"] || value["file_type"] == null) {
            lastMessagesHashmap[`${key}`] = value["message"];
          } else {
            if (value["file_type"] == "IMAGE") {
              lastMessagesHashmap[`${key}`] = "Image...";
            } else {
              lastMessagesHashmap[`${key}`] = "Video...";
            }
          }
        });
      }
      setLastMessageToAllUsers(lastMessagesHashmap);
      setAllUsersMessages(getAllUsers.data);
      localStorage.setItem("id", response?.data?.user?.id);
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("email", response?.data?.user?.email);
      localStorage.setItem("name", response?.data?.user?.name);
      setUserInfo({
        id: response?.data?.user?.id,
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
        token: response?.data?.token,
      });
      // if (response?.data?.user?.is_verified) {
      setReceiverInfo({
        userInfo: {
          id: 0,
          email: "",
          name: "",
          connection_status: "",
        },
        data: [],
      });
      setShowToast(true);
      setToastType("success");
      setToastMessage("Successfully Logged In...");
      setTimeout(() => {
        setShowToast(false);
        setToastMessage("");
        router.push("/main_page");
      }, 2000);
      // } else {
      // setOtpModalFlag(true);
      // }
    } catch (error: any) {
      // if (axios.isAxiosError(error)) {
      //   console.log("Axios error:", error.response?.data || error.message);
      // } else {
      //   console.log("Unknown error:", error);
      // }
      if (error?.response?.status >= 400) {
        console.log(error?.response?.data?.detail?.status);
        console.log(error?.response?.data?.detail?.message);
        setShowToast(true);
        setToastType(error?.response?.data?.detail?.status);
        setToastMessage(error?.response?.data?.detail?.message);
        if (error?.response?.status == 403) {
          localStorage.setItem("email", email);

          setOtpModalFlag(true);
          setLoginModalFlag(false);
        }
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
    wsRef?.current?.close();
    wsRef.current = null;
    router.push("/");
  };

  const getAllReceiverDetails = async (receId: any, limit: any) => {
    // const getReceiverInfo = await axios.get(
    //   // `http://127.0.0.1:8000/api/messages/${userInfo.id}/${receId}`,
    //   `${process.env.NEXT_PUBLIC_BASE_URL}messages/${userInfo.id}/${receId}`,
    //   // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
    // );
    if (limit < 15) {
      limit = 15;
    } else {
      limit += 5;
    }
    const getReceiverInfo = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}messages/${userInfo.id}/${receId}?limit=${limit}`,
    );
    let idsOfUnseenMessages: any = [];

    getReceiverInfo?.data?.data.forEach((item: any) => {
      if (item.seen_flag == false && userInfo.id == item.receiver) {
        idsOfUnseenMessages.push(item.id);
      }
    });
    console.log("Ids of Unseen Messages: ", idsOfUnseenMessages);
    const senderId = localStorage.getItem("id");
    if (idsOfUnseenMessages) {
      const payload = {
        receiver: senderId, // actually these are messages send by someone else, to you so you become a receiever in this scenerio and the receiver is the sender
        sender: getReceiverInfo?.data?.userInfo?.id,
        message_ids: idsOfUnseenMessages,
      };
      // const payload = idsOfUnseenMessages;
      const resOfMessagesStatusUpdate = await axios.patch(
        // `http://127.0.0.1:8000/api/messages/unseen`,
        `${process.env.NEXT_PUBLIC_BASE_URL}messages/unseen`,
        payload,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
      );
    }

    console.log("success:", getReceiverInfo.data);
    setReceiverInfo(getReceiverInfo.data);
    setHasMore(getReceiverInfo.data.hasMore);
    // if (allUsersMessages[receId]&&allUsersMessages[receId]["data"]){

    // }
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
  const onVerify = async (otp: string) => {
    const val = localStorage.getItem("email");
    console.log(otp);
    const payload = { email: val, otp: otp };
    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/users/login",
        `${process.env.NEXT_PUBLIC_BASE_URL}users/verify-otp`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/login",
        payload,
      );

      const getAllUsers = await axios.get(
        // `http://127.0.0.1:8000/api/users/${response?.data?.user?.id}`,
        `${process.env.NEXT_PUBLIC_BASE_URL}users/${response?.data?.user?.id}`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/"
      );
      const token = await requestNotificationPermission();
      console.log(token, " This is the token");
      if (token) {
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
      }
      var client_id = Date.now();

      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}ws/${client_id}/${response?.data?.user?.email}`,
      );
      wsRef.current = ws;

      wsRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      console.log("✅ Success:", response.data);
      setLoginModalFlag(false);
      console.log("These are the users: ", getAllUsers);
      // setUsers(getAllUsers.data);
      setShowToast(true);
      setToastType("success");
      setToastMessage(response?.data?.user?.detail);
      setOtpModalFlag(false);
      let lastMessagesHashmap: any = {};
      if (getAllUsers.data) {
        Object.entries(getAllUsers.data).forEach(([key, value]: any) => {
          // console.log(key);
          // console.log(value);
          // lastMessagesHashmap[`${key}`] = value["message"];
          if (value["message"] || value["file_type"] == null) {
            lastMessagesHashmap[`${key}`] = value["message"];
          } else {
            if (value["file_type"] == "IMAGE") {
              lastMessagesHashmap[`${key}`] = "Image...";
            } else {
              lastMessagesHashmap[`${key}`] = "Video...";
            }
          }
        });
      }
      setLastMessageToAllUsers(lastMessagesHashmap);
      setAllUsersMessages(getAllUsers.data);
      localStorage.setItem("id", response?.data?.user?.id);
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("email", response?.data?.user?.email);
      localStorage.setItem("name", response?.data?.user?.name);
      setUserInfo({
        id: response?.data?.user?.id,
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
        token: response?.data?.token,
      });
      // if (response?.data?.user?.is_verified) {
      router.push("/main_page");
      setShowToast(false);
      setToastMessage("");
    } catch (error: any) {
      console.log(error?.response?.data?.detail?.status);
      console.log(error?.response?.data?.detail?.message);
      setShowToast(true);
      setToastType(error?.response?.data?.detail?.status);
      setToastMessage(error?.response?.data?.detail?.message);
    }
  };
  const onResend = async () => {
    console.log("Resend OTP");
    const val = localStorage.getItem("email");
    const payload = { email: val };
    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/users/login",
        `${process.env.NEXT_PUBLIC_BASE_URL}users/resend-otp`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/login",
        payload,
      );
      setShowToast(true);
      setToastType(response?.data?.detail?.status);
      setToastMessage(response?.data?.detail?.message);
    } catch (error: any) {
      console.log(error?.response?.data?.detail?.status);
      console.log(error?.response?.data?.detail?.message);
      setShowToast(true);
      setToastType(error?.response?.data?.detail?.status);
      setToastMessage(error?.response?.data?.detail?.message);
    }
  };

  const resetPassword = async (payload: any) => {
    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/users/login",
        `${process.env.NEXT_PUBLIC_BASE_URL}users/reset-password`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/login",
        payload,
      );
      setShowToast(true);
      setToastType(response?.data?.detail?.status);
      setToastMessage(response?.data?.detail?.message);
    } catch (error: any) {
      console.log(error?.response?.data?.detail?.status);
      console.log(error?.response?.data?.detail?.message);
      setShowToast(true);
      setToastType(error?.response?.data?.detail?.status);
      setToastMessage(error?.response?.data?.detail?.message);
    }
  };

  const forgotPassword = async (payload: any) => {
    try {
      if (
        payload.email == "demo1@chatapp.com" ||
        payload.email == "demo2@chatapp.com"
      ) {
        setShowToast(true);
        setToastType("warning");
        setToastMessage(
          `${payload.email}, this account is for demo purpose you can't change it's password`,
        );
        return;
      }
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/users/login",
        `${process.env.NEXT_PUBLIC_BASE_URL}users/forgot-password`,
        // "https://chat-application-fastapi-postgres-production.up.railway.app/api/users/login",
        payload,
      );
      setShowToast(true);
      setToastType(response?.data?.detail?.status);
      setToastMessage(response?.data?.detail?.message);
      setForgotPasswordModalFlag(false);
    } catch (error: any) {
      console.log(error?.response?.data?.detail?.status);
      console.log(error?.response?.data?.detail?.message);
      setShowToast(true);
      setToastType(error?.response?.data?.detail?.status);
      setToastMessage(error?.response?.data?.detail?.message);
    }
  };
  // otpModalFlag={otpModalFlag}
  // setOtpModalFlag={setOtpModalFlag}
  // email="khizar@gmail.com"
  // onVerify={(otp: string) => {
  //   console.log(otp);
  // }}
  // onResend={() => {
  //   console.log("Resend OTP");
  // }}

  // useEffect(() => {
  //   return () => {
  //     if (wsRef.current) {
  //       wsRef.current.close();
  //       wsRef.current = null;
  //     }
  //   };
  // }, []);

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
        onVerify,
        onResend,
        hasMore,
        setHasMore,
        toastType,
        showToast,
        forgotPasswordModalFlag,
        setForgotPasswordModalFlag,
        toastMessage,
        setToastType,
        setShowToast,
        setToastMessage,
        resetPassword,
        forgotPassword,
        lastMessageToAllUsers,
        setLastMessageToAllUsers,
        // users,
        // setUsers,
        otpModalFlag,
        setOtpModalFlag,
        wsRef,
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
