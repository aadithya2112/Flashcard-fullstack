import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { z } from "zod";

// Define the Zod schema for validation
const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignInFormInputs = {
  username: string;
  email: string;
  password: string;
};

export default function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>({
    resolver: async (data) => {
      try {
        signInSchema.parse(data); // Validate the form data with Zod
        return { values: data, errors: {} };
      } catch (err) {
        if (err instanceof z.ZodError) {
          return {
            values: {},
            errors: err.errors.reduce((acc: any, curr) => {
              acc[curr.path[0]] = { message: curr.message };
              return acc;
            }, {}),
          };
        }
        return { values: {}, errors: {} };
      }
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/login", data);
      console.log(response.data);
      const { token } = response.data;
      localStorage.setItem("token", token); // Store JWT in localStorage
      navigate("/"); // Redirect to home page
      window.location.reload(); // Refresh to update context
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-purple-400">Welcome Back</h2>
        <p className="text-center text-gray-400">Sign in to access your account</p>

        {error && (
          <div className="p-4 bg-red-500 text-white rounded-md">
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`w-full p-2 mt-1 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                errors.username ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full p-2 mt-1 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                errors.email ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full p-2 mt-1 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                errors.password ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-md text-white font-medium ${
              loading
                ? "bg-purple-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-400"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}