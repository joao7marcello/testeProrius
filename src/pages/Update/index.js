import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Update = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailConf, setEmailConf] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { updateProfile, user } = useAuth();

  useEffect(() => {
    // Populate the form fields with user data when the component mounts
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
      setEmailConf(user.email || "");
    }
  }, [user]);

  const handleUpdate = () => {
    if (!nome | !email | !emailConf) {
      setError("Preencha todos os campos");
      return;
    }
    if (!email) {
      setError("Preencha o campo de E-mail");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Digite um e-mail válido");
      return;
    }

    if (email !== emailConf) {
      setError("Os emails não são iguais");
      return;
    }

    const res = updateProfile(user.id, { nome, email });

    if (res) {
      setError(res);
      return;
    }

    alert("Dados atualizados com sucesso!");
    navigate("/home");
  };

  return (
    <C.Container>
      <C.Label>UPDATE DE DADOS</C.Label>
      <C.Content>
        <C.LabelForm>Nome:</C.LabelForm>
        <Input
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => [setNome(e.target.value), setError("")]}
        />
        <C.LabelForm>Email:</C.LabelForm>
        <Input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => [setEmail(e.target.value), setError("")]}
        />
        <C.LabelFormGrande>Confirme seu email:</C.LabelFormGrande>
        <Input
          type="email"
          placeholder="Confirme seu E-mail"
          value={emailConf}
          onChange={(e) => [setEmailConf(e.target.value), setError("")]}
        />
        <C.labelError>{error}</C.labelError>

        <Button Text="Atualizar Perfil" onClick={handleUpdate} />
      </C.Content>
    </C.Container>
  );
};

export default Update;
