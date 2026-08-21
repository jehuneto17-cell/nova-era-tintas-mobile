import { collection, onSnapshot, query, type Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";
import type { ProdutoCor } from "./types";

function toCor(id: string, data: Record<string, unknown>): ProdutoCor {
  return {
    corId: id,
    codigo: data.codigo as string | undefined,
    nome: (data.nome as string) ?? "",
    hex: (data.hex as string) ?? "#CCCCCC",
  };
}

/** Assina a paleta global de cores da loja (usada por produtos com todasCores=true). */
export function subscribeCores(
  onChange: (cores: ProdutoCor[]) => void
): Unsubscribe {
  const q = query(collection(db, "cores"));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => toCor(d.id, d.data())));
  });
}
