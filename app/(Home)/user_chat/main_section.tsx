"use client";

import { Footer } from "./../../components/footer";
import Navbar from "./../../components/header";
import { Hero } from "./../main-section-landing-page";
import { useAppContext } from "./../../context-provider/context_Provider";
import SideBar from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { validateFile, getFileType } from "@/schemas/fileValidation";
import { uploadFileWithProgress } from "@/schemas/fileUpload";
import {
  receiverDetails,
  receiverData,
} from "./../../context-provider/context_Provider";
import { CheckCheck, Paperclip } from "lucide-react";
import axios from "axios";
export default function MainSection() {
  var client_id = Date.now();
  const [text, setText] = useState("");
  const router = useRouter();
  // add these states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    userInfo,
    setUserInfo,
    receiverInfo,
    setReceiverInfo,
    setAllUsersMessages,
    wsRef,
    lastMessageToAllUsers,
    setLastMessageToAllUsers,
    hasMore,
    setHasMore,
  } = useAppContext();

  // const wsRef = useRef<WebSocket | null>(null);
  const receiverInfoRef = useRef<any>("");
  const userInfoRef = useRef<any>("");
  const lastMessageToAllUsersRef = useRef<any>({});

  const [loadingOldMessages, setLoadingOldMessages] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  console.log("Receiver: ", receiverInfo);

  function sendMessage() {
    // if (!userInfo || !receiverInfo) {
    //   return;
    // }
    // let data: any = {
    //   sender: userInfo.id,
    //   message: text,
    //   receiver: receiverInfo.userInfo.id,
    // };

    // wsRef.current?.send(JSON.stringify(data));
    // console.log("Message Sent");
    // setText("");
    // event.preventDefault();
    if (!userInfo || !receiverInfo) return;
    if (!text.trim() && !selectedFile) return; // nothing to send

    // if there is a file — upload first then deliver via the upload endpoint
    if (selectedFile) {
      setIsUploading(true);
      setUploadProgress(0);

      uploadFileWithProgress(
        selectedFile,
        text, // caption (can be empty)
        userInfo.id,
        receiverInfo.userInfo.id,
        userInfo.token,
        (percent) => {
          setUploadProgress(percent);
        },
        (data) => {
          // upload complete — message already saved and delivered
          // via WebSocket in the backend upload endpoint
          setIsUploading(false);
          setUploadProgress(0);
          clearFile();
          setText("");
        },
        (error) => {
          setIsUploading(false);
          setUploadProgress(0);
          setFileError(error);
        },
      );
      return;
    }

    // text only message — send via WebSocket as before
    const data = {
      sender: userInfo.id,
      message: text,
      receiver: receiverInfo.userInfo.id,
    };
    wsRef.current?.send(JSON.stringify(data));
    setText("");
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate with yup
    const error = await validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    setFileType(getFileType(file));

    // create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setUploadProgress(0);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    lastMessageToAllUsersRef.current = lastMessageToAllUsers;
  }, [lastMessageToAllUsers]);

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
    var client_id = Date.now();
    if (!wsRef.current) {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}ws/${client_id}/${email}`,
      );
      wsRef.current = ws;
      wsRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };
    }

    console.log(token, email, name);
    if (!token && !name && !email) {
      setUserInfo({ id: 0, name: "", email: "", token: "" });
      router.push("/");
    } else {
      console.log(email);

      wsRef.current.onmessage = (event: any) => {
        console.log("📩 Message from server:", event.data);
        const currentUser = userInfoRef.current;
        const currentReceiver = receiverInfoRef.current.userInfo;
        let newMessage: any = JSON.parse(event.data);
        console.log("Current User: ", currentUser);
        console.log("Current Receiver", currentReceiver);
        let tempHashmap: any = {};
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
          if (Number(currentReceiver.id) == Number(newMessage.userId)) {
            setReceiverInfo((prev: receiverDetails) => ({
              userInfo: {
                ...prev.userInfo,
                connection_status: newMessage?.connection_status,
              },
              data: [...prev.data],
            }));
          }
        } else if (
          Number(currentUser.id) == Number(newMessage.sender) &&
          newMessage.seen_flag == true
        ) {
          setReceiverInfo((prev: any) => {
            let tempArr = [...prev.data];
            for (let i = tempArr.length - 1; i >= 0; i--) {
              if (Number(tempArr[i]["id"]) == Number(newMessage.id)) {
                tempArr[i]["seen_flag"] = true;
                break;
              }
            }
            return { userInfo: prev.userInfo, data: tempArr };
          });
        } else if (Number(currentUser.id) == Number(newMessage.sender)) {
          // setReceiverInfo((prev: receiverDetails) => ({
          //   userInfo: prev.userInfo,
          //   data: [...prev.data, newMessage],
          // }));
          // tempHashmap = { ...lastMessageToAllUsersRef.current };
          // tempHashmap[`${currentReceiver.id}`] = newMessage.caption;
          // setLastMessageToAllUsers(tempHashmap);
          if (newMessage.messages_seen == true) {
            setReceiverInfo((prev: any) => {
              let tempArr = [...prev.data];
              for (let i = tempArr.length - 1; i >= 0; i--) {
                if (tempArr[i]["seen_flag"] == false) {
                  tempArr[i]["seen_flag"] = true;
                } else {
                  break;
                }
              }
              return { userInfo: prev.userInfo, data: tempArr };
            });
          } else {
            setReceiverInfo((prev: receiverDetails) => ({
              userInfo: prev.userInfo,
              data: [...prev.data, newMessage],
            }));
            tempHashmap = { ...lastMessageToAllUsersRef.current }; // ✅ FIXED
            if (newMessage.caption || newMessage.file == null) {
              tempHashmap[`${currentReceiver.id}`] = newMessage.caption;
            } else {
              if (newMessage.file_type == "IMAGE") {
                tempHashmap[`${currentReceiver.id}`] = "Image...";
              } else {
                tempHashmap[`${currentReceiver.id}`] = "Video...";
              }
            }
            // tempHashmap[`${currentReceiver.id}`] = newMessage.caption; // ✅ FIXED
            setLastMessageToAllUsers(tempHashmap);
          }
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
            tempHashmap = { ...lastMessageToAllUsersRef.current };
            if (newMessage.caption || newMessage.file == null) {
              tempHashmap[`${currentReceiver.id}`] = newMessage.caption;
            } else {
              if (newMessage.file_type == "IMAGE") {
                tempHashmap[`${currentReceiver.id}`] = "Image...";
              } else {
                tempHashmap[`${currentReceiver.id}`] = "Video...";
              }
            }

            setLastMessageToAllUsers(tempHashmap);
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
            tempHashmap = { ...lastMessageToAllUsersRef.current };
            if (newMessage.caption || newMessage.file == null) {
              tempHashmap[`${newMessage.sender}`] = newMessage.caption;
            } else {
              if (newMessage.file_type == "IMAGE") {
                tempHashmap[`${newMessage.sender}`] = "Image...";
              } else {
                tempHashmap[`${newMessage.sender}`] = "Video...";
              }
            }

            setLastMessageToAllUsers(tempHashmap);
          }
        }
      };

      wsRef.current.onclose = () => console.log("❌ WebSocket closed");
    }
    setTimeout(() => {
      const container = messagesContainerRef.current;

      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }, []);


  useEffect(() => {

  const container =
    messagesContainerRef.current;

  if (!container) return;

  const handleScroll = () => {

    if (
      container.scrollTop < 100
    ) {
      loadOlderMessages();
    }

  };

  container.addEventListener(
    "scroll",
    handleScroll
  );

  return () => {
    container.removeEventListener(
      "scroll",
      handleScroll
    );
  };

}, [
  receiverInfo,
  hasMore,
  loadingOldMessages
]);

  const loadOlderMessages = async () => {

  if (
    !hasMore ||
    loadingOldMessages ||
    !receiverInfo?.data?.length
  ) return;

  setLoadingOldMessages(true);

  const oldestMessageId =
    receiverInfo.data[0].id;

  const container =
    messagesContainerRef.current;

  const previousHeight =
    container?.scrollHeight || 0;

  try {

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}messages/${userInfo.id}/${receiverInfo.userInfo.id}`,
      {
        params: {
          before_message_id: oldestMessageId,
          limit: 30
        }
      }
    );

    const olderMessages = res.data.data;

    setReceiverInfo((prev: any) => ({
      ...prev,
      data: [
        ...olderMessages,
        ...prev.data
      ]
    }));

    setHasMore(res.data.hasMore);

    setTimeout(() => {

      if (container) {

        const newHeight =
          container.scrollHeight;

        container.scrollTop =
          newHeight - previousHeight;
      }

    }, 0);

  } finally {

    setLoadingOldMessages(false);

  }

};

  function formatTime(timestamp: string) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <div className="flex h-full">
        {/* <SideBar Type="not mobile"/> */}

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
                ref={messagesContainerRef}
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
                    const isMine = item.sender === userInfo.id;

                    return (
                      <div
                        key={item.id}
                        className={`flex items-start space-x-2 mb-4 ${isMine ? "justify-end" : ""}`}
                      >
                        {!isMine && (
                          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {receiverInfo?.userInfo?.name.slice(0, 2)}
                            </span>
                          </div>
                        )}

                        <div
                          className={`message-bubble rounded-lg p-3 shadow-sm max-w-xs
                ${isMine ? "bg-green-300 text-black" : "bg-white"}`}
                        >
                          {/* image */}
                          {item.file && item.file_type === "IMAGE" && (
                            <img
                              src={item.file}
                              alt={item.file_name || "image"}
                              className="rounded-lg max-w-full cursor-pointer mb-1"
                              style={{ maxWidth: "260px" }}
                              onClick={() => window.open(item.file, "_blank")}
                            />
                          )}

                          {/* video */}
                          {item.file && item.file_type === "VIDEO" && (
                            <video
                              src={item.file}
                              controls
                              className="rounded-lg max-w-full mb-1"
                              style={{ maxWidth: "260px" }}
                            />
                          )}

                          {/* caption */}
                          {item.caption && (
                            <p className="text-sm">{item.caption}</p>
                          )}

                          {/* time and tick */}
                          <div
                            className={`flex items-center mt-1 space-x-1
                    ${isMine ? "justify-end" : ""}`}
                          >
                            <span className="text-xs text-gray-500">
                              {formatTime(item.created_at)}
                            </span>
                            {isMine && (
                              <CheckCheck
                                size={12}
                                className={
                                  item.seen_flag
                                    ? "text-blue-400"
                                    : "text-gray-400"
                                }
                              />
                            )}
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
                {/* file error */}
                {fileError && (
                  <div className="text-red-500 text-xs mb-2 px-2">
                    {fileError}
                  </div>
                )}

                {/* file preview before sending */}
                {filePreview && selectedFile && (
                  <div className="relative mb-3 inline-block">
                    {fileType === "image" ? (
                      <img
                        src={filePreview}
                        alt="preview"
                        className="h-24 rounded-lg object-cover"
                      />
                    ) : (
                      <video src={filePreview} className="h-24 rounded-lg" />
                    )}

                    {/* remove file button */}
                    {!isUploading && (
                      <button
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500
                               text-white rounded-full text-xs flex items-center
                               justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}

                    {/* upload progress overlay */}
                    {isUploading && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50
                                rounded-lg flex flex-col items-center justify-center"
                      >
                        <div className="text-white text-sm font-bold mb-1">
                          {uploadProgress}%
                        </div>
                        <div className="w-16 bg-gray-300 rounded-full h-1.5">
                          <div
                            className="bg-blue-400 h-1.5 rounded-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  {/* hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,
                    video/mp4,video/quicktime,video/webm"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {/* paperclip button — triggers file input */}
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* <i data-lucide="paperclip" className="w-5 h-5 text-gray-500"></i> */}
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={
                        selectedFile ? "Add a caption..." : "Type a message..."
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200
                           rounded-full focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:bg-white transition-all"
                      value={text}
                      disabled={isUploading}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !isUploading) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>

                  {/* send button */}
                  <div
                    className={`w-7 h-7 mt-1 cursor-pointer duration-700 hover:scale-110
                       ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => {
                      if (!isUploading) sendMessage();
                    }}
                  >
                    <img
                      className="w-full h-full"
                      src="icons8-sent-24.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full">
              <div className="w-80 h-56 mx-auto mt-[6%]">
                <img
                  className="w-full h-full"
                  src="istockphoto-1399269182-1024x1024.jpg"
                  alt=""
                />
              </div>
              <div className="flex w-full p-1">
                <div className="font-serif font-bold text-2xl mt-6 mx-auto">
                  Let's have some Chit-Chat
                </div>
              </div>
              <div className="flex justify-center mt-7">
                {" "}
                <button className="py-1 px-5 bg-blue-500 text-white ring-1 rounded-2xl text-lg font-serif font-semibold tracking-wider">
                  About Us
                </button>
              </div>
              <div className="flex justify-center mt-10">
                <div className="bgLockImage">
                  Your personal messages are end-to-end encrypted
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
