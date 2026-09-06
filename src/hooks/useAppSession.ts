// (Full file replacement — updated DEFAULT_STATE and added `login` wrapper)
import { useState, useEffect, useCallback } from "react";
import { type ExpertId, type DomainDetection } from "@/data/experts";

export type AppPage = "login" | "query" | "thinking" | "domain_selection" | "result";

export interface ExtendedHistoryItem {
  id?: string;
  query: string;
  domains: DomainDetection[];
  selectedDomains: ExpertId[];
  responses: Record<ExpertId, string>;
  summary: string[];
  timestamp: number;
}

export interface AppState {
  page: AppPage;
  query: string;
  detections: DomainDetection[];
  selectedDomains: ExpertId[];
  responses: Record<ExpertId, string> | null;
  summary: string[] | null;
}

// DEFAULT_STATE changed to start at "query" instead of "login"
const DEFAULT_STATE: AppState = {
  page: "query",
  query: "",
  detections: [],
  selectedDomains: [],
  responses: null,
  summary: null,
};

export interface UserProfile {
  id: string; // Google 'sub' or other unique id
  name?: string;
  email?: string;
  picture?: string;
  token?: string; // id token
}

function decodeJwt(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // Add padding if necessary
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
    const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
}

export function useAppSession() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<ExtendedHistoryItem[]>([]);
  const [currentState, setCurrentState] = useState<AppState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("council_current_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as UserProfile;
          setUser(parsed);
          if (parsed.email) loadUserData(parsed.email);
          else loadUserData(parsed.id);
        } catch (e) {
          // Backwards compatibility: previously stored a plain username string
          setUser({ id: stored });
          loadUserData(stored);
        }
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = (username: string) => {
    try {
      // Load History
      const storedHistory = localStorage.getItem(`council_history_${username}`);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      // Load State
      const storedState = localStorage.getItem(`council_app_state_${username}`);
      if (storedState) {
        const data = JSON.parse(storedState) as AppState;
        if (data.page === "login") {
          setCurrentState({ ...data, page: "query" });
        } else {
          setCurrentState(data);
        }
      } else {
        setCurrentState({ ...DEFAULT_STATE, page: "query" });
      }
    } catch (e) {
      console.error("Failed to load user data", e);
      setCurrentState({ ...DEFAULT_STATE, page: "query" });
    } finally {
      setIsLoading(false);
    }
  };

  const syncStateToStorage = (username: string, state: AppState) => {
    try {
      localStorage.setItem(`council_app_state_${username}`, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to sync state", e);
    }
  };

  // loginWithGoogle accepts an ID token (JWT) returned by Google's Identity Services
  const loginWithGoogle = (idToken: string) => {
    try {
      const payload = decodeJwt(idToken);
      if (!payload) {
        console.error("Invalid ID token");
        return;
      }

      const profile: UserProfile = {
        id: payload.sub || payload.user_id || `${Date.now()}`,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        token: idToken,
      };

      localStorage.setItem("council_current_user", JSON.stringify(profile));
      setUser(profile);

      const key = profile.email ?? profile.id;
      loadUserData(key);
    } catch (e) {
      console.error("Failed to login with Google", e);
    }
  };

  // New compatibility wrapper: `login` accepts either an ID token (JWT) or an email string.
  // - If given a JWT, it calls loginWithGoogle(idToken)
  // - If given a plain email, it creates a guest/local profile and proceeds
  const login = (input: string) => {
    if (!input) return;
    // Heuristic: JWTs contain two dots (header.payload.signature)
    const parts = input.split(".");
    if (parts.length === 3) {
      // Treat as ID token
      loginWithGoogle(input);
      return;
    }

    // Otherwise treat as an email/username fallback (legacy behavior)
    try {
      const profile: UserProfile = {
        id: input,
        email: input.includes("@") ? input : undefined,
        name: input.includes("@") ? input.split("@")[0] : input,
      };
      localStorage.setItem("council_current_user", JSON.stringify(profile));
      setUser(profile);
      const key = profile.email ?? profile.id;
      loadUserData(key);
    } catch (e) {
      console.error("Failed to perform fallback login", e);
    }
  };

  const logout = () => {
    try {
      if (user) {
        const key = user.email ?? user.id;
        // Optionally: clear stored app state for the user or keep it
        // localStorage.removeItem(`council_app_state_${key}`);
      }
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("council_current_user");
    setUser(null);
    setHistory([]);
    setCurrentState({ ...DEFAULT_STATE, page: "query" });
  };

  const navigate = useCallback((page: AppPage, preserveState: boolean = true) => {
    setCurrentState((prev) => {
      const nextState: AppState = {
        ...prev,
        page,
        query: preserveState ? prev.query : "",
        detections: preserveState ? prev.detections : [],
        selectedDomains: preserveState ? prev.selectedDomains : [],
        responses: preserveState ? prev.responses : null,
        summary: preserveState ? prev.summary : null,
      };
      if (user) {
        const key = user.email ?? user.id;
        syncStateToStorage(key, nextState);
      }
      return nextState;
    });
  }, [user]);

  const goBack = useCallback(() => {
    setCurrentState((prev) => {
      let nextPage = prev.page;
      if (prev.page === "result") nextPage = "domain_selection";
      else if (prev.page === "domain_selection") nextPage = "query";

      if (nextPage === prev.page) return prev; // No back action

      const nextState = { ...prev, page: nextPage };
      if (user) {
        const key = user.email ?? user.id;
        syncStateToStorage(key, nextState);
      }
      return nextState;
    });
  }, [user]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setCurrentState((prev) => {
      const nextState = { ...prev, ...updates };
      if (user) {
        const key = user.email ?? user.id;
        syncStateToStorage(key, nextState);
      }
      return nextState;
    });
  }, [user]);

  const saveHistoryItem = useCallback((item: Omit<ExtendedHistoryItem, "id">) => {
    if (!user) return;
    try {
      const savedItem = { id: `${Date.now()}`, ...item };
      setHistory((prev) => {
        const newHistory = [savedItem, ...prev].slice(0, 50);
        const key = user.email ?? user.id;
        localStorage.setItem(`council_history_${key}`, JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }, [user]);

  const loadHistoryItem = useCallback((item: ExtendedHistoryItem) => {
    const nextState: AppState = {
      page: "result",
      query: item.query,
      detections: item.domains,
      selectedDomains: item.selectedDomains,
      responses: item.responses,
      summary: item.summary,
    };
    setCurrentState(nextState);
    if (user) {
      const key = user.email ?? user.id;
      syncStateToStorage(key, nextState);
    }
  }, [user]);

  return {
    user,
    history,
    currentState,
    isLoading,
    // compatibility: `login` accepts email or ID token (JWT)
    login,
    // kept for backward compatibility but now expects an ID token
    loginWithGoogle,
    logout,
    navigate,
    goBack,
    updateState,
    saveHistoryItem,
    loadHistoryItem,
  };
}
