import { useState } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  return { user, setUser };
}
