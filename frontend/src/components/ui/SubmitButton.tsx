interface SubmitButtonProps {
    loading: boolean;
  }
  
  const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => {
    return (
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 mt-4 rounded-md text-white font-medium ${
          loading
            ? "bg-purple-500 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-400"
        }`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    );
  };
  
  export default SubmitButton;