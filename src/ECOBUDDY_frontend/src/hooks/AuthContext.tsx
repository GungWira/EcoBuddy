import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { createActor } from "../../../declarations/ECOBUDDY_backend";
import { canisterId } from "../../../declarations/ECOBUDDY_backend/index.js";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";

interface User {
  id: Principal;
  username: string;
  level: number;
  walletAddres: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: Principal | null;
  actor: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updateUser: User) => void;
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  identity: null,
  principal: null,
  actor: null,
  login: async () => {},
  logout: async () => {},
  user: null,
  loading: true,
  updateUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      const loggedIn = await client.isAuthenticated();
      setIsAuthenticated(loggedIn);
      if (loggedIn) {
        const userIdentity = client.getIdentity();
        const userPrincipal = userIdentity.getPrincipal();
        const userActor: any = createActor(canisterId, {
          agentOptions: { identity: userIdentity },
        });

        const accountIdentifier = AccountIdentifier.fromPrincipal({
          principal: userPrincipal,
          subAccount: undefined,
        });

        const result = await userActor.createUser(accountIdentifier.toHex());

        if ("ok" in result) {
          setUser(result.ok);
          setIdentity(userIdentity);
          setPrincipal(userPrincipal);
          setActor(userActor);
          setLoading(false);
        } else {
          console.log("User are not verifed");
          logout();
        }
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider:
          process.env.REACT_APP_II_URL || "https://identity.ic0.app",
        onSuccess: async () => {
          const userIdentity = authClient.getIdentity();
          const userPrincipal = userIdentity.getPrincipal();
          const userActor = createActor(canisterId, {
            agentOptions: { identity: userIdentity },
          });

          try {
            const userData = await userActor.getUserById(userPrincipal);
            if (userData) {
              setUser(userData[0]);
            } else {
              console.log("User not found");
            }
            setIsAuthenticated(true);
            setIdentity(userIdentity);
            setPrincipal(userPrincipal);
            setActor(userActor);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        },
      });
    }
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setActor(null);
      setUser(null);
    }
  };

  const updateUser = (updateUser: User) => {
    setUser(updateUser);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        identity,
        principal,
        actor,
        login,
        logout,
        user,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
