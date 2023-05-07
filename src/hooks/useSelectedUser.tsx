import { useState } from "react";

export function useSelectedUser() {
  const [selected, setSelected] = useState<any>(null);
  return { selected, setSelected };
}
