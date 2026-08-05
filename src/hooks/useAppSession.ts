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

const DEFAULT_STATE: AppState = {
  page: "login",
  query: "",
  detections: [],
  selectedDomains: [],
  responses: null,
  summary: null,
};

export function useAppSession() {
  const [user, setUser] = useState<string | null>(null);
  const [history, setHistory] = useState<ExtendedHistoryItem[]>([]);
  const [currentState, setCurrentState] = useState<AppState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state from local storage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("council_current_user");
      if (storedUser) {
        setUser(storedUser);
        loadUserData(storedUser);
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

  const login = (username: string) => {
    localStorage.setItem("council_current_user", username);
    setUser(username);
    loadUserData(username);
  };

  const logout = () => {
    localStorage.removeItem("council_current_user");
    setUser(null);
    setHistory([]);
    setCurrentState({ ...DEFAULT_STATE, page: "login" });
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
      if (user) syncStateToStorage(user, nextState);
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
      if (user) syncStateToStorage(user, nextState);
      return nextState;
    });
  }, [user]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setCurrentState((prev) => {
      const nextState = { ...prev, ...updates };
      if (user) syncStateToStorage(user, nextState);
      return nextState;
    });
  }, [user]);

  const saveHistoryItem = useCallback((item: Omit<ExtendedHistoryItem, "id">) => {
    if (!user) return;
    try {
      const savedItem = { id: `${Date.now()}`, ...item };
      setHistory((prev) => {
        const newHistory = [savedItem, ...prev].slice(0, 50);
        localStorage.setItem(`council_history_${user}`, JSON.stringify(newHistory));
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
    if (user) syncStateToStorage(user, nextState);
  }, [user]);

  return {
    user,
    history,
    currentState,
    isLoading,
    login,
    logout,
    navigate,
    goBack,
    updateState,
    saveHistoryItem,
    loadHistoryItem,
  };
}
