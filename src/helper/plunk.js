import Plunk from "@plunk/node";

const plunkKey = import.meta.env.VITE_PUBLIC_PLUNK_PUBLIC_KEY;

if (!plunkKey) {
  throw new Error("Missing Plunk public key");
}

export const plunk = new Plunk(plunkKey);
