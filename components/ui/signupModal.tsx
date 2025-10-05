
import { useAppContext } from "@/app/context-provider/context_Provider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/schemas/signupSchema";


interface SignupFormData {
    name: string,
    email:string,
    password:string,
    confirm_password:string
}
export default function SignupModal (){

      const {signup,login} = useAppContext();

      const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

 

  const triggerSignupHandler = async(data: SignupFormData) =>{
            console.log(data)
            const obj = { name:data?.name,email:data?.email,password:data?.password}
           await signup(obj);
  }

    return(
          <div id="signupModal" className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl slide-up">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
                <button  className="text-gray-400 hover:text-gray-600 transition-colors">
                    <i data-lucide="x" className="w-6 h-6"></i>
                </button>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit(triggerSignupHandler)}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" {...register("name")}  placeholder="Enter your full name"/>
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" {...register("email")}  placeholder="Enter your email"/>
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" {...register("password")}  placeholder="Create a password"/>
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" {...register("confirm_password")}  placeholder="Confirm your password"/>
                            {errors.confirm_password && <p className="text-red-500">{errors.confirm_password.message}</p>}

                </div>
                
                <div>
                    <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"/>
                        <span className="ml-2 text-sm text-gray-600">I agree to the Terms of Service and Privacy Policy</span>
                    </label>
                </div>
                
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors" >
                    Create Account
                </button>
            </form>
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account? 
                    <button className="text-purple-600 hover:text-purple-800 transition-colors font-medium">Sign in</button>
                </p>
            </div>
        </div>
    </div>
    );
}