'use client'
import React, {Dispatch, SetStateAction} from "react";
import { createContext, useState } from "react";

type GlobalStateValues = {
  title?: string,
}
interface GlobalState {
  globalState?: GlobalStateValues | undefined,
  setGlobalState?: Dispatch<SetStateAction<GlobalStateValues | undefined>>,
}

export const GlobalContext = createContext<GlobalState>({
  globalState: undefined,
  setGlobalState: ()=> undefined,
})

export default function GlobalProvider({children}:{children: React.ReactNode}) {
  const [globalState, setGlobalState] = useState<GlobalStateValues>();
  const value: GlobalState = {globalState, setGlobalState};

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}
