"use client";
import { LogoLoading } from "@/components/root/logo-loading";
import { apiV1 } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { setCookie } from "nookies";
import { createContext, useContext, useEffect, useState, type PropsWithChildren, type ReactNode } from "react";
import { useNavigate } from "react-router";

// const EXPIRATION_OFFSET = 1000 * 60 * 5; // 5 minutes
const EXPIRATION_OFFSET = 1000 * 15; // 15 seconds

type User = {
  id: string;
  name: string;
  email: string;
};

type Credentials = {
  accessToken: string
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
};

type AuthContextType = {
  user: User | null;
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function checkRefreshTokenIsValid(credentials: Credentials) {
  if (!credentials) return false;

  const now = Date.now();
  const refreshExpires = new Date(credentials.refreshTokenExpiresIn).getTime();

  return now < refreshExpires - EXPIRATION_OFFSET;
}

function loadUserFromLocalStorage(): User | null {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function loadCredentialsFromLocalStorage(): Credentials | null {
  try {
    const stored = localStorage.getItem("credentials");
    if (stored) {
      const credentials = JSON.parse(stored);
      if (!checkRefreshTokenIsValid(credentials))
        return null;

      return credentials;
    }
    return null;
  } catch {
    return null;
  }
}



function getIsIntialized(credentials: Credentials): boolean {
  if (!credentials.accessToken)
    return false;

  const now = Date.now();
  const isAccessTokenValid = now < (new Date(credentials.accessTokenExpiresIn).getTime() - EXPIRATION_OFFSET);

  return isAccessTokenValid;
}


export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials | null>(loadCredentialsFromLocalStorage());
  // const [user, setUser] = useState<User | null>(loadUserFromLocalStorage());
  const [initialized, setInitialized] = useState(credentials ? getIsIntialized(credentials) : false);


  if (credentials)
    apiV1.defaults.headers.common["Authorization"] = `Bearer ${credentials.accessToken}`;

  const queryCache = useQueryClient();
  const { data: user, isPending, refetch } = useQuery({
    enabled: initialized && !!credentials,
    initialData: loadUserFromLocalStorage(),
    queryKey: ["me"],
    queryFn: async () => await getUserData(),
    initialDataUpdatedAt: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 0
  })

  function clear() {
    setCredentials(null);
    queryCache.clear();
    localStorage.removeItem("credentials");
    localStorage.removeItem("user");
    apiV1.defaults.headers.common["Authorization"] = "";
  }

  function logout() {
    clear();

    navigate("/login");
  }

  const login = (credentials: Credentials) => {
    setInitialized(true);
    setCredentials({ ...credentials })
    localStorage.setItem("credentials", JSON.stringify(credentials));
  };

  const getUserData = async () => {
    const { data } = await apiV1.get("/me");
    localStorage.setItem("user", JSON.stringify(data));
    return data as User;
  };

  const isAuthenticated = !!credentials;


  useEffect(() => {
    if (credentials) {
      setCookie(null, "access-token", credentials.accessToken);
      // apiV1.defaults.headers.common["Authorization"] = `Bearer ${credentials.accessToken}`;

    } else {
      // delete apiV1.defaults.headers.common["Authorization"];
      clear();
      navigate("/login");
    }
    console.info("AuthProvider: Updated API headers with credentials");
  }, [credentials]);

  useEffect(() => {
    if (user && user.role === "none") {
      refetch();
    }
  }, [user])


  return (
    <AuthContext.Provider value={{ updateUserData: () => refetch(), user, login, initialized, logout, isAuthenticated }}>
      <TokenRenewer credentials={credentials} />
      {children}
    </AuthContext.Provider>
  );
}

export function TokenRenewer({ credentials }: { credentials: Credentials | null }) {
  const { login, logout } = useAuth();


  const { isError } = useQuery({
    enabled: !!credentials?.refreshToken,
    queryKey: ["renew-token"],
    retry: 3,
    queryFn: async () => {

      const isValid = checkAccessTokenIsValid();

      if (isValid)
        return true;

      const { data } = await apiV1.get("/auth/refresh-token", {
        params: { refreshToken: credentials?.refreshToken }
      });

      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpiresIn: data.accessTokenExpiresIn,
        refreshTokenExpiresIn: data.refreshTokenExpiresIn,
      });

      return true;
    },
    // throwOnError: true,
    staleTime: 60 * 1000, // 1 minute
  });



  const checkAccessTokenIsValid = () => {
    if (!credentials) return false;

    const now = Date.now();
    const accessExpires = new Date(credentials.accessTokenExpiresIn).getTime();

    return now < accessExpires - EXPIRATION_OFFSET;
  }

  useEffect(() => {
    if (isError)
      logout();
  }, [isError, logout])

  return null;


}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function OnlyInitializedAuth({ children }: { children: ReactNode }) {
  const { initialized, user } = useAuth();

  if (!initialized || !user)
    return <LogoLoading />

  // if (user?.role === "none" && window.location.pathname !== "/onboarding")
  //   return <Navigate to="/onboarding" replace />

  return children;

}

export function Can({ action, children }: { action: string; children: ReactNode }) {
  return <>{children}</>;
}