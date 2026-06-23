// "use client";
// import { useAppContext } from "@/app/context-provider/context_Provider";

// const SideBar = () => {
//   const {
//     allUsersMessages,
//     setAllUsersMessages,
//     setReceiverInfo,
//     userInfo,
//     getAllReceiverDetails,
//   } = useAppContext();
//   console.log(allUsersMessages);
//   console.log("User Info: ", userInfo);
//   return (
//     <>
//       <div className="w-full sm:w-80  bg-white border-r border-gray-200 flex flex-col">
//         <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
//                 <span className="text-white font-semibold">
//                   {userInfo.name.split(" ")[0].slice(0, 1)}
//                   {/* {userInfo.name.split(" ")[1].slice(0, 1)} */}
//                 </span>
//               </div>
//               <div>
//                 <h1 className="font-semibold text-gray-900">
//                   {userInfo.name}(You)
//                 </h1>
//                 <p className="text-xs text-gray-500">Online</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
//                 <i
//                   data-lucide="message-square-plus"
//                   className="w-5 h-5 text-gray-600"
//                 ></i>
//               </button>
//               <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
//                 <i
//                   data-lucide="more-vertical"
//                   className="w-5 h-5 text-gray-600"
//                 ></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//           <div className="relative">
//             <i
//               data-lucide="search"
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
//             ></i>
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto scrollbar-hide">
//           {allUsersMessages ? (
//             Object.entries(allUsersMessages).map(
//               ([userId, item]: [string, any]) => (
//                 <div
//                   className="contact-item bg-blue-50 border-l-4 border-blue-500 px-4 py-3 hover:bg-blue-100 cursor-pointer transition-colors relative"
//                   onClick={async () => {
//                     // setReceiverInfo({ ...item });
//                     await getAllReceiverDetails(item?.userInfo.id);
//                   }}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className="relative">
//                       <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
//                         <span className="text-white font-semibold">
//                           {item &&
//                           item?.userInfo?.name &&
//                           item?.userInfo?.name?.length > 2
//                             ? item?.userInfo?.name.slice(0, 2)
//                             : item?.userInfo?.name}
//                         </span>
//                       </div>
//                       {item.userInfo.connection_status == "online" && (
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {item?.userInfo?.name}
//                         </h3>
//                         <span className="text-xs text-gray-500">2:30 PM</span>
//                       </div>
//                       <p className="text-sm text-gray-600 truncate">
//                         {/* That sounds great! Let's do it 🚀 */}
//                         {item && item?.data.length > 0
//                           ? item?.data[item.data.length - 1]?.caption
//                           : "--------------------------------------"}
//                       </p>
//                     </div>
//                     <div className="absolute top-1 right-1 text-[12px] font-bold text-white items-end">
//                       {item && item?.data.length > 0 && (
//                         <div className=" bg-blue-500 rounded-full  px-1.5">
//                           {item?.data.length}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ),
//             )
//           ) : (
//             <></>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SideBar;

"use client";
import { useAppContext } from "@/app/context-provider/context_Provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SideBar = (prop: any) => {
  const {
    allUsersMessages,
    setAllUsersMessages,
    setReceiverInfo,
    userInfo,
    getAllReceiverDetails,
    lastMessageToAllUsers,
  } = useAppContext();

  useEffect(() => {
    if (prop.Type == "mobile") {
      setReceiverInfo({
        userInfo: {
          id: 0,
          email: "",
          name: "",
          connection_status: "",
        },
        data: [],
      });
    }
  }, []);

  const router = useRouter();
  return (
    <div className="w-full sm:w-80 h-full flex flex-row sideBarLeftPortion border-r border-gray-700">
      {/* ── Left icon strip ── */}
      <div className="w-14 max-sm:hidden sideBarLeftPortion flex flex-col items-center justify-between py-4 border-r border-gray-700">
        {/* Chat icon – top */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          {/* <i data-lucide="message-square" className="w-5 h-5 text-gray-300"></i> */}
          <img
            className="w-[70%] h-[70%] mt-1"
            src="icons8-comments-30.png"
            alt=""
          />
        </div>

        {/* Settings + avatar – bottom */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            {/* <i data-lucide="settings" className="w-5 h-5 text-gray-300"></i> */}
            <img
              className="w-[70%] h-[70%] mt-1"
              src="icons8-settings-30 (1).png"
              alt=""
            />
          </div>

          {/* Current user avatar */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white font-semibold text-sm">
              {userInfo.name.split(" ")[0].slice(0, 1)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-white font-serif">Chats</h1>
          <div className="flex items-center gap-4">
            <button className="w-7 h-7 flex items-center justify-center hover:opacity-75 transition-opacity">
              <i
                data-lucide="message-square-plus"
                className="w-5 h-5 text-gray-300"
              ></i>
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:opacity-75 transition-opacity">
              <i
                data-lucide="more-vertical"
                className="w-5 h-5 text-gray-300"
              ></i>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="relative">
            <i
              data-lucide="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            ></i>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-4 py-1.5  border searchBGImage rounded-xl text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 px-4 py-2">
          {["All", "Unread", "Groups"].map((tab) => (
            <button
              key={tab}
              className="py-1 px-3 rounded-3xl bg-gray-600 text-gray-200 text-xs font-serif cursor-pointer hover:bg-gray-500 transition-colors"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contact list */}
        <div className="flex-1 no-scrollbar  overflow-y-auto scrollbar-hide px-2 py-1 space-y-2">
          {allUsersMessages ? (
            Object.entries(allUsersMessages).map(
              ([userId, item]: [string, any]) => (
                <div
                  key={userId}
                  className="w-full bg-white p-2 flex items-center gap-3 rounded-lg border border-gray-200 cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={async () => {
                    if (prop.Type == "mobile") {
                      setReceiverInfo({ userInfo: item?.userInfo, data: [] });
                      await getAllReceiverDetails(
                        item?.userInfo.id,
                        item.data.length,
                      );
                      router.push("/user_chat");
                    } else {
                      setReceiverInfo({ userInfo: item?.userInfo, data: [] });
                      await getAllReceiverDetails(
                        item?.userInfo.id,
                        item.data.length,
                      );
                    }
                  }}
                >
                  {/* Avatar with online indicator */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {item?.userInfo?.name && item.userInfo.name.length > 2
                          ? item.userInfo.name.slice(0, 2)
                          : item?.userInfo?.name}
                      </span>
                    </div>
                    {item.userInfo.connection_status === "online" && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Name + last message */}
                  <div className="flex-1 min-w-0">
                    <div className="text-blue-600 font-semibold font-serif text-sm truncate">
                      {item?.userInfo?.name}
                    </div>
                    <div className="text-gray-500 text-xs font-serif truncate">
                      {lastMessageToAllUsers[`${userId}`]
                        ? lastMessageToAllUsers[`${userId}`]
                        : "Hey there, I am using K-Chat"}
                    </div>
                  </div>

                  {/* Message count badge */}
                  {item?.data?.length > 0 && (
                    <div className="flex-shrink-0 bg-blue-500 text-white text-[11px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                      {item.data.length}
                    </div>
                  )}
                </div>
              ),
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
