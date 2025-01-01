import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import SubmitButton from "../components/ui/SubmitButton";
import InputField from "../components/ui/InputField";

// Define the Zod schema for validation
const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignUpFormInputs = {
  username: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>({
    resolver: async (data) => {
      try {
        signUpSchema.parse(data); // Validate the form data with Zod
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

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", data);
      const { token } = response.data;
      localStorage.setItem("token", token); // Store JWT in localStorage
      navigate("/"); // Redirect to home page
      window.location.reload(); // Refresh to update context
    } catch (err: any) {
      setError(err.response?.data?.message || "Error during sign-up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-purple-400">Create an Account</h2>
        <p className="text-center text-gray-400">Sign up to start using your account</p>

        {error && (
          <div className="p-4 bg-red-500 text-white rounded-md">
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            id="username"
            label="Username"
            type="text"
            register={register}
            error={errors.username}
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password}
          />
          <SubmitButton loading={loading} />
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/signin" className="text-purple-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}