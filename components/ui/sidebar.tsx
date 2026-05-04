"use client";
import { useAppContext } from "@/app/context-provider/context_Provider";

const SideBar = () => {
  const {
    allUsersMessages,
    setAllUsersMessages,
    setReceiverInfo,
    userInfo,
    getAllReceiverDetails,
  } = useAppContext();
  console.log(allUsersMessages);
  console.log("User Info: ", userInfo);
  return (
    <>
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userInfo.name.split(" ")[0].slice(0, 1)}
                  {/* {userInfo.name.split(" ")[1].slice(0, 1)} */}
                </span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">
                  {userInfo.name}(You)
                </h1>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <i
                  data-lucide="message-square-plus"
                  className="w-5 h-5 text-gray-600"
                ></i>
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <i
                  data-lucide="more-vertical"
                  className="w-5 h-5 text-gray-600"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <i
              data-lucide="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            ></i>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {allUsersMessages ? (
            Object.entries(allUsersMessages).map(
              ([userId, item]: [string, any]) => (
                <div
                  className="contact-item bg-blue-50 border-l-4 border-blue-500 px-4 py-3 hover:bg-blue-100 cursor-pointer transition-colors relative"
                  onClick={async () => {
                    // setReceiverInfo({ ...item });
                    await getAllReceiverDetails(item?.userInfo.id);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {item &&
                          item?.userInfo?.name &&
                          item?.userInfo?.name?.length > 2
                            ? item?.userInfo?.name.slice(0, 2)
                            : item?.userInfo?.name}
                        </span>
                      </div>
                      {item.userInfo.connection_status == "online" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item?.userInfo?.name}
                        </h3>
                        <span className="text-xs text-gray-500">2:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {/* That sounds great! Let's do it 🚀 */}
                        {item && item?.data.length > 0
                          ? item?.data[item.data.length - 1]?.caption
                          : "--------------------------------------"}
                      </p>
                    </div>
                    <div className="absolute top-1 right-1 text-[12px] font-bold text-white items-end">
                      {item && item?.data.length > 0 && (
                        <div className=" bg-blue-500 rounded-full  px-1.5">
                          {item?.data.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )
          ) : (
            <></>
          )}

          {/*                 
                <div className="contact-item px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100" >
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">BJ</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">Bob Johnson</h3>
                                <span className="text-xs text-gray-500">1:15 PM</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">Can we schedule a meeting?</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</div>
                        </div>
                    </div>
                </div>

           
                <div className="contact-item px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100" >
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">SW</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">Sarah Wilson</h3>
                                <span className="text-xs text-gray-500">12:45 PM</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">Thanks for your help!</p>
                        </div>
                    </div>
                </div>

    
                <div className="contact-item px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100" >
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                                <i data-lucide="users" className="w-6 h-6 text-white"></i>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">Team Alpha</h3>
                                <span className="text-xs text-gray-500">11:30 AM</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">Mike: The project is ready for review</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</div>
                        </div>
                    </div>
                </div> */}

          {/* <div className="contact-item px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">ED</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">Emma Davis</h3>
                                <span className="text-xs text-gray-500">Yesterday</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">See you tomorrow!</p>
                        </div>
                    </div>
                </div> */}
        </div>
      </div>
    </>
  );
};

export default SideBar;
