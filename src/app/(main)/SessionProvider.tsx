import { Session, User } from "lucia"
import { createContext, useContext } from "react";

interface SessionProviderTypes {
    user:User;
    session:Session
}

const sessionContext = createContext<SessionProviderTypes | null>(null)

export default function SessionProvider({children,value}:{children:React.ReactNode,value:SessionProviderTypes}) {

    return <sessionContext.Provider value={value}>{children}</sessionContext.Provider>
}


export function useSession() {
    const context = useContext(sessionContext);
    if (!context) {
      throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
  }