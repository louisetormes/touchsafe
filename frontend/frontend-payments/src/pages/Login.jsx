import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../components/RegisterModal";

export default function Login() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);
  
    try {
      const response = await fetch(
        "http://localhost:8080/realms/master/protocol/openid-connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );
  
      console.log(formData)
      console.log(response)
      if (!response.ok) {
        throw new Error("Falha na autenticação");
      }
  
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("client_id", clientId);
  
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Login com Keycloak</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Client ID
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Client Secret
          </label>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            required
          />
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Entrar
          </button>
        </div>
      </form>
      <button
        onClick={() => setShowRegister(true)}
        className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
      >
        Não tem uma conta? Cadastre-se
      </button>

      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)} 
      />
    </div>
  );
}