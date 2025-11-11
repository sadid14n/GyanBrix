import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebaseConfig";

export const makeAdmin = async (email) => {
  const fn = httpsCallable(functions, "setAdminRole");
  return await fn({ email });
};

export const removeAdmin = async (email) => {
  const fn = httpsCallable(functions, "removeAdminRole");
  return await fn({ email });
};
