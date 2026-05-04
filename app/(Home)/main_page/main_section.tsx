"use client";

import { Footer } from "./../../components/footer";
import Navbar from "./../../components/header";
import { Hero } from "./../main-section-landing-page";
import { useAppContext } from "./../../context-provider/context_Provider";
import SideBar from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  receiverDetails,
  receiverData,
} from "./../../context-provider/context_Provider";
export default function MainSection() {
  var client_id = Date.now();
  const [text, setText] = useState("");
  const router = useRouter();
  const {
    userInfo,
    setUserInfo,
    receiverInfo,
    setReceiverInfo,
    setAllUsersMessages,
  } = useAppContext();

  const wsRef = useRef<WebSocket | null>(null);
  const receiverInfoRef = useRef<any>("");
  const userInfoRef = useRef<any>("");

  console.log("Receiver: ", receiverInfo);

  function sendMessage() {
    if (!userInfo || !receiverInfo) {
      return;
    }
    let data: any = {
      sender: userInfo.id,
      message: text,
      receiver: receiverInfo.userInfo.id,
    };

    wsRef.current?.send(JSON.stringify(data));
    console.log("Message Sent");
    setText("");
    // event.preventDefault();
  }

  useEffect(() => {
    receiverInfoRef.current = receiverInfo;
  }, [receiverInfo]);

  useEffect(() => {
    userInfoRef.current = userInfo;
  }, [userInfo]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    console.log(token, email, name);
    if (!token && !name && !email) {
      setUserInfo({ id: 0, name: "", email: "", token: "" });
      router.push("/");
    } else {
      console.log(email);
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}ws/${client_id}/${email}`,
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      ws.onmessage = (event) => {
        console.log("📩 Message from server:", event.data);
        const currentUser = userInfoRef.current;
        const currentReceiver = receiverInfoRef.current.userInfo;
        let newMessage: any = JSON.parse(event.data);
        console.log("Current User: ", currentUser);
        console.log("Current Receiver", currentReceiver);
        if (
          newMessage?.connectionNews == "user_connected" ||
          newMessage?.connectionNews == "user_disconnected"
        ) {
          setAllUsersMessages((item: any) => {
            return {
              ...item,
              [Number(newMessage.userId)]: {
                ...item[Number(newMessage.userId)],
                userInfo: {
                  ...item[Number(newMessage.userId)]["userInfo"],
                  connection_status: newMessage?.connection_status,
                },
              },
            };
          });
        } else if (Number(currentUser.id) == Number(newMessage.sender)) {
          setReceiverInfo((prev: receiverDetails) => ({
            userInfo: prev.userInfo,
            data: [...prev.data, newMessage],
          }));
        } else {
          // let flag=false
          if (
            Number(currentReceiver.id) == Number(newMessage.sender) &&
            Number(currentUser.id) == Number(newMessage.receiver)
          ) {
            newMessage.seen_flag = true;
            setReceiverInfo((prev: receiverDetails) => ({
              userInfo: prev.userInfo,
              data: [...prev.data, newMessage],
            }));
            newMessage.changeStatus = true;
            wsRef.current?.send(JSON.stringify(newMessage));
          } else if (Number(currentUser.id) == Number(newMessage.receiver)) {
            setAllUsersMessages((item: any) => {
              return {
                ...item,
                [Number(newMessage.sender)]: {
                  ...item[Number(newMessage.sender)],
                  data: [
                    ...item[Number(newMessage.sender)]["data"],
                    newMessage,
                  ],
                },
              };
            });
          }
        }
      };

      ws.onclose = () => console.log("❌ WebSocket closed");

      return () => {
        ws.close();
        wsRef.current = null;
      };
    }
  }, []);

  return (
    <>
      <div className="flex h-full">
        <SideBar />

        <div className="flex-1 flex flex-col">
          {receiverInfo &&
          receiverInfo.userInfo &&
          receiverInfo?.userInfo?.email &&
          receiverInfo?.userInfo?.name ? (
            <>
              <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold" id="chatAvatar">
                      {receiverInfo?.userInfo?.name.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900" id="chatName">
                      {receiverInfo?.userInfo?.name}
                    </h2>
                    <p className="text-sm text-green-600">
                      {receiverInfo?.userInfo?.connection_status != "offline"
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <i
                      data-lucide="phone"
                      className="w-5 h-5 text-gray-600"
                    ></i>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <i
                      data-lucide="video"
                      className="w-5 h-5 text-gray-600"
                    ></i>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <i data-lucide="info" className="w-5 h-5 text-gray-600"></i>
                  </button>
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto scrollbar-hide chat-pattern p-6"
                id="messagesContainer"
              >
                <div className="flex justify-center mb-4">
                  <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                    Today
                  </span>
                </div>

                {receiverInfo && receiverInfo.data.length > 0 ? (
                  receiverInfo?.data?.map((item: any) => {
                    if (item.receiver == userInfo.id) {
                      return (
                        <div className="flex items-start space-x-2 mb-4">
                          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {receiverInfo?.userInfo?.name.slice(0, 2)}
                            </span>
                          </div>
                          <div className="message-bubble bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-gray-800">{item.caption}</p>
                            <span className="text-xs text-gray-500 mt-1 block">
                              2:30 PM
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-start space-x-2 mb-4 justify-end">
                        <div className="message-bubble bg-blue-500 text-white rounded-lg p-3 shadow-sm">
                          <p>{item.caption}</p>
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <span className="text-blue-100 text-xs">
                              2:31 PM
                            </span>
                            <i
                              data-lucide="check-check"
                              className="w-3 h-3 text-blue-200"
                            ></i>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>

              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <i
                      data-lucide="paperclip"
                      className="w-5 h-5 text-gray-500"
                    ></i>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      id="messageInput"
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      // onkeypress="handleKeyPress(event)"
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <i
                        data-lucide="smile"
                        className="w-5 h-5 text-gray-500"
                      ></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors shadow-lg"
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    <i data-lucide="send" className="w-5 h-5 text-white"></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
