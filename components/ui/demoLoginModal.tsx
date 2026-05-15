

const DEMOLOGINMODAL = ({handleCloseDemoModal}:any) =>{

    return(
         <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div
      className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-7
                 animate-in fade-in zoom-in duration-300 slide-up no-scrollbar sm:max-h-[100vh] sm:overflow-y-auto "
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Experience Real-Time Chat
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Recruiters and visitors can instantly explore the application
            using demo accounts below.
          </p>
        </div>

        <button
          onClick={handleCloseDemoModal}
          className="text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="font-semibold text-gray-800">
            Demo Account 1
          </p>

          <p className="text-sm mt-2 text-gray-700">
            Email:
            <span className="font-medium ml-1">
              demo1@chatapp.com
            </span>
          </p>

          <p className="text-sm text-gray-700">
            Password:
            <span className="font-medium ml-1">
              Demo@123
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
          <p className="font-semibold text-gray-800">
            Demo Account 2
          </p>

          <p className="text-sm mt-2 text-gray-700">
            Email:
            <span className="font-medium ml-1">
              demo2@chatapp.com
            </span>
          </p>

          <p className="text-sm text-gray-700">
            Password:
            <span className="font-medium ml-1">
              Demo@123
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-gray-100 p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          To test real-time messaging features:
        </p>

        <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Open two browser such as chrome and firefox etc or tabs/windows</li>
          <li>Login with different demo accounts</li>
          <li>Send messages in real-time</li>
          <li>Watch delivery/read ticks update instantly</li>
        </ul>
      </div>

      <button
        onClick={handleCloseDemoModal}
        className="w-full mt-6 rounded-2xl bg-blue-600 py-3 text-white
                   font-semibold hover:bg-blue-700 transition-all"
      >
        Continue
      </button>
    </div>
  </div>
)
}
export default DEMOLOGINMODAL;