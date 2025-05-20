import { useState } from "react";
import { Key, UserPlus } from "lucide-react";

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    clientId: "",
    clientSecret: "",
    confirmSecret: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.clientSecret !== formData.confirmSecret) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      const adminToken = await getAdminToken();
      
      await createKeycloakClient(adminToken, formData.clientId, formData.clientSecret);
      
      setSuccess("Client criado com sucesso!");
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const getAdminToken = async () => {
    const response = await fetch(
      "http://localhost:8080/realms/realm/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "password",
            client_id: "admin-cli", 
            username: "admin",     
            password: "admin"
        }),
      }
    );

    console.log("Enviando para Keycloak:", getAdminToken.toString());

    console.log("Resposta do Keycloak:", {
        status: response.status,
        statusText: response.statusText,
      });


    if (!response.ok) throw new Error("Falha ao obter token admin");

    const data = await response.json();
  console.log("Token recebido:", data.access_token); // Token JWT completo
  return data.access_token;
  };
  


  const createKeycloakClient = async (token, clientId, secret) => {
    const response = await fetch(
      `http://localhost:8080/admin/realms/realm/clients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          clientId,
          secret,
          enabled: true,
          protocol: "openid-connect",
          publicClient: false,
          redirectUris: ["*"],
          webOrigins: ["*"],
          serviceAccountsEnabled: true,
          standardFlowEnabled: true,
          directAccessGrantsEnabled: true
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errorMessage || "Falha ao criar client");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <UserPlus className="mr-2" size={20} />
            Criar novo usuário
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome do Client (ID)
            </label>
            <input
              type="text"
              value={formData.clientId}
              onChange={(e) => setFormData({...formData, clientId: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Senha (Secret)
            </label>
            <input
              type="password"
              value={formData.clientSecret}
              onChange={(e) => setFormData({...formData, clientSecret: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={formData.confirmSecret}
              onChange={(e) => setFormData({...formData, confirmSecret: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-700 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            >
              <Key className="mr-2" size={16} />
              Criar Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;