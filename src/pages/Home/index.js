import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import * as C from "./styles";

const Home = () => {
  const { user, signout, excluirUsuario } = useAuth();
  const navigate = useNavigate();

  const handleExcluir = () => {
    excluirUsuario();
    alert("Usuário excluído com sucesso!");
  };

  return (
    <C.Container>
      {user && <C.Title>{`Olá ${user.nome}`}</C.Title>}
      {user && (
        <C.SubTitle>{`Seu e-mail cadastrado é: ${user.email}`}</C.SubTitle>
      )}

      <Button
        Text="Excluir"
        onClick={() => [handleExcluir(), signout(), navigate("/")]}
      />
      <Button Text="Update" onClick={() => [navigate("/update")]}>
        Update
      </Button>
      <Button Text="Sair" onClick={() => [signout(), navigate("/")]}>
        Sair
      </Button>
    </C.Container>
  );
};

export default Home;
