import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function GoogleCallback() {
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleGoogleCallback().then(() => navigate("/"));
  }, [handleGoogleCallback, navigate]);

  return <div>Autenticando...</div>;
}
