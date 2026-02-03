import AuthModal from "../components/AuthModal";

const Login = () => {
  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0">
      {/* Blur background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal center */}
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <AuthModal />
      </div>

    </div>
  );
};

export default Login;
