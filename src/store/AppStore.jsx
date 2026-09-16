import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadState, saveState, resetState } from "../services/db";
import { authService } from "../services/authService";
import { syncService } from "../services/syncService";
const C = createContext(null);
export const useApp = () => useContext(C);
export function AppProvider({ children }) {
  const [state, setState] = useState(null),
    [toast, setToast] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    const demoRequested =
      import.meta.env.DEV &&
      import.meta.env.VITE_ENABLE_DEMO_TOOLS === "true" &&
      new URLSearchParams(window.location.search).get("demo") === "1";
    if (demoRequested) {
      resetState("demo")
        .then(setState)
        .catch(() => setError("Local demo data could not be loaded."));
      return;
    }
    authService.session().then(async session => {
      const loaded=await loadState(session?.user?.id);
      setState({...loaded,session:{authenticated:!!session,onboarded:session?loaded.session?.onboarded||false:false,userId:session?.user?.id||null}});
    })
      .catch(() => setError("Local data could not be loaded."));
  }, []);
  useEffect(() => {
    if (state)
      saveState(state, state.session?.userId).catch(() =>
        setError("Changes could not be saved on this device."),
      );
  }, [state]);
  useEffect(() => {
    if(!state?.session?.authenticated)return;
    const timer=setTimeout(()=>syncService.flush(state).then(next=>setState(current=>current.lastSavedAt===state.lastSavedAt?next:current)).catch(()=>{}),1500);
    return()=>clearTimeout(timer);
  },[state?.lastSavedAt,state?.session?.authenticated]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);
  const update = (fn) =>
    setState((s) => {
      const n = typeof fn === "function" ? fn(s) : fn;
      return { ...n, lastSavedAt: new Date().toISOString() };
    });
  const api = useMemo(
    () => ({
      state,
      update,
      notify: setToast,
      error,
      setError,
      reset: async (mode) => setState(await resetState(mode)),
    }),
    [state, error],
  );
  return (
    <C.Provider value={api}>
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </C.Provider>
  );
}
