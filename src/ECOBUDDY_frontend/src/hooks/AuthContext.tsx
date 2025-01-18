import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { createActor } from "../../../declarations/ECOBUDDY_backend";
import { canisterId } from "../../../declarations/ECOBUDDY_backend/index.js";

interface AuthContextProps {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: string | null;
  actor: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  identity: null,
  principal: null,
  actor: null,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      const loggedIn = await client.isAuthenticated();
      setIsAuthenticated(loggedIn);
      if (loggedIn) {
        const userIdentity = client.getIdentity();
        const userPrincipal = userIdentity.getPrincipal().toText();
        const userActor = createActor(canisterId, {
          agentOptions: { identity: userIdentity },
        });

        setIdentity(userIdentity);
        setPrincipal(userPrincipal);
        setActor(userActor);
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
          const userPrincipal = userIdentity.getPrincipal().toText();
          const userActor = createActor(canisterId, {
            agentOptions: { identity: userIdentity },
          });

          setIsAuthenticated(true);
          setIdentity(userIdentity);
          setPrincipal(userPrincipal);
          setActor(userActor);
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
    }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
