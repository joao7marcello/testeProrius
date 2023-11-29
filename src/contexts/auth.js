import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const usersStorage = localStorage.getItem("users_bd");

    if (userToken && usersStorage) {
      const hasUser = JSON.parse(usersStorage)?.filter(
        (user) => user.email === JSON.parse(userToken).email
      );

      if (hasUser) setUser(hasUser[0]);
    }
  }, []);

  let signin = (email, password) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));
    const hasUser = usersStorage?.filter((user) => user.email === email);

    if (hasUser?.length) {
      const user = hasUser[0];
      // Check if the account is valid
      if (user.valido === false) {
        return "Conta excluída";
      }

      if (user.email === email && user.password === password) {
        const token = Math.random().toString(36).substring(2);
        localStorage.setItem(
          "user_token",
          JSON.stringify({ email, token, valido: user.valido, nome: user.nome })
        );
        setUser({ email, password, valido: user.valido, nome: user.nome });
        return;
      } else {
        return "E-mail ou senha incorretos";
      }
    } else {
      return "Usuário não cadastrado";
    }
  };

  const signup = (nome, email, password, valido) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));

    const hasUser = usersStorage?.filter(
      (user) => user.email === email || user.nome === nome
    );

    if (hasUser?.length) {
      return "Já tem uma conta com esse e-mail ou nome";
    }
    valido = true;
    let newUser;

    if (usersStorage) {
      newUser = [...usersStorage, { nome, email, password, valido }];
    } else {
      newUser = [{ nome, email, password, valido }];
    }

    localStorage.setItem("users_bd", JSON.stringify(newUser));

    return;
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  const excluirUsuario = () => {
    const userToken = localStorage.getItem("user_token");
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));

    if (userToken && usersStorage) {
      const userEmail = JSON.parse(userToken).email;

      // Update the 'valido' property for the logged-in user
      const updatedUsers = usersStorage.map((user) =>
        user.email === userEmail ? { ...user, valido: false } : user
      );

      // Save the updated users back to localStorage
      localStorage.setItem("users_bd", JSON.stringify(updatedUsers));
    }

    // Perform the logout
    signout();
  };

  const updateProfile = (userId, updatedData) => {
    // Check if the user is logged in
    if (!user) {
      return "Usuário não autenticado";
    }

    // Check if the provided userId matches the logged-in user's id
    if (userId !== user.id) {
      return "ID do usuário não corresponde";
    }

    // Update user information in the state
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));

    // Update user information in localStorage
    const userToken = localStorage.getItem("user_token");
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));

    if (userToken && usersStorage) {
      const userEmail = JSON.parse(userToken).email;

      const updatedUsers = usersStorage.map((userData) =>
        userData.email === userEmail
          ? { ...userData, ...updatedData }
          : userData
      );

      localStorage.setItem("users_bd", JSON.stringify(updatedUsers));
    }

    // For this example, just returning null to indicate success
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        signin,
        signup,
        signout,
        excluirUsuario,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
