import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import {
  canisterId,
  createActor,
} from "../../../declarations/ECOBUDDY_backend";
import { Principal } from "@dfinity/principal";
import { Identity } from "@dfinity/agent";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import DailyQuest from "@/components/Chat/DailyQuest";

interface DailyQuest {
  date: string;
  login: boolean;
  chatCount: number;
  quizCount: number;
}

interface AuthContextProps {
  isAuth: boolean;
  authUser: any;
  identity: Identity | null;
  principal: Principal | null;
  callFunction: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updateUser: any) => void;
  user: any;
  loading: boolean;
  dailyQuest: DailyQuest | null;
  updateDailyQuest: (dailyQuest: DailyQuest) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
  authUser: null,
  identity: null,
  principal: null,
  callFunction: null,
  login: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  user: null,
  loading: true,
  dailyQuest: null,
  updateDailyQuest: () => {},
});

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },

  loginOptions: {
    identityProvider: "http://be2us-64aaa-aaaaa-qaabq-cai.localhost:8080/",
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [principal, setPrincipal] = useState<any>(null);
  const [callFunction, setCallFunction] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [dailyQuest, setDailyQuest] = useState<DailyQuest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authClient = await AuthClient.create(options.createOptions);

        const isAuthenticated = await authClient.isAuthenticated();
        setIsAuth(isAuthenticated);

        const identity = authClient.getIdentity();
        setIdentity(identity);

        const principal = identity.getPrincipal();
        setPrincipal(principal);

        setAuthUser(authClient);

        const actor = createActor(canisterId, {
          agentOptions: {
            identity,
          },
        });

        const accountIdentifier = AccountIdentifier.fromPrincipal({
          principal: principal,
          subAccount: undefined,
        });

        const result = await actor.createUser(accountIdentifier.toHex());
        if ("ok" in result) {
          setUser(result.ok);
          const today = new Date()
            .toLocaleDateString("id-ID", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .split("/")
            .reverse()
            .join("-");
          const dq = await actor.checkDailyQuest(principal, today);
          if ("ok" in dq) {
            setDailyQuest({
              date: dq.ok.date,
              login: dq.ok.login,
              chatCount: Number(dq.ok.chatCount),
              quizCount: Number(dq.ok.quizCount),
            });
          } else {
            setDailyQuest({
              date: today,
              login: false,
              chatCount: 0,
              quizCount: 0,
            });
          }
        } else {
          console.log("User are not verifed");
          logout();
        }

        setCallFunction(actor);
      } catch (error) {
        console.error("Error during initAuth:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  async function login() {
    setLoading(true);
    if (authUser) {
      authUser.login({
        ...options.loginOptions,
        onSuccess: async () => {
          const isAuthenticated = await authUser.isAuthenticated();
          setIsAuth(isAuthenticated);

          const identity = authUser.getIdentity();
          setIdentity(identity);

          const principal = identity.getPrincipal();
          setPrincipal(principal);

          setAuthUser(authUser);

          const actor = createActor(canisterId, {
            agentOptions: {
              identity,
            },
          });

          const accountIdentifier = AccountIdentifier.fromPrincipal({
            principal: principal,
            subAccount: undefined,
          });

          const result = await actor.createUser(accountIdentifier.toHex());

          if ("ok" in result) {
            setUser(result.ok);
            const today = new Date()
              .toLocaleDateString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .split("/")
              .reverse()
              .join("-");
            const dq = await actor.checkDailyQuest(principal, today);
            if ("ok" in dq) {
              setDailyQuest({
                date: dq.ok.date,
                login: dq.ok.login,
                chatCount: Number(dq.ok.chatCount),
                quizCount: Number(dq.ok.quizCount),
              });
            } else {
              setDailyQuest({
                date: today,
                login: false,
                chatCount: 0,
                quizCount: 0,
              });
            }
          } else {
            console.log("User are not verifed");
            logout();
          }

          setCallFunction(actor);
          setLoading(false);
        },
      });
    }
    setLoading(false);
  }

  async function logout() {
    setLoading(true);
    if (authUser) {
      await authUser.logout();
      setIsAuth(false);
      setIdentity(null);
      setPrincipal(null);
      setCallFunction(null);
      setUser(null);
    }
    setLoading(true);
  }

  const updateUser = (updateUser: any) => {
    setUser(updateUser);
  };

  const updateDailyQuest = (updateDailyQuest: any) => {
    setDailyQuest(updateDailyQuest);
  };

  return {
    isAuth,
    login,
    logout,
    authUser,
    identity,
    principal,
    callFunction,
    user,
    loading,
    updateUser,
    dailyQuest,
    updateDailyQuest,
  };
};

export const AuthProvider = ({ children }: any) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
