

const SPAMINFOMODAL=({setShowSpamModal}:any)=>{
    return(
  <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div
      className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-7
                 animate-in fade-in zoom-in duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            OTP Delivery Notice
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Important information before signing up.
          </p>
        </div>

        <button
          onClick={() => setShowSpamModal(false)}
          className="text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
        <p className="text-sm text-gray-700 leading-relaxed">
          If you create a new account, your OTP email may arrive in the
          <span className="font-semibold"> Spam/Junk folder</span>.
        </p>

        <p className="text-sm text-gray-700 leading-relaxed mt-4">
          This happens because the application currently uses a free
          SendGrid account without authenticated domain email sending.
        </p>

        <p className="text-sm text-gray-700 leading-relaxed mt-4">
          Please check your spam folder if the OTP does not appear in inbox.
        </p>
      </div>

      <button
        onClick={() => setShowSpamModal(false)}
        className="w-full mt-6 rounded-2xl bg-black py-3 text-white
                   font-semibold hover:opacity-90 transition-all"
      >
        Got it
      </button>
    </div>
  </div>
)
}

export default SPAMINFOMODAL;