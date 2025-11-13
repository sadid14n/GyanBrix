import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebaseConfig";

export const makeAdmin = async (phoneNumber) => {
  const fn = httpsCallable(functions, "setAdminRole");
  return await fn({ phoneNumber });
};

export const removeAdmin = async (phoneNumber) => {
  const fn = httpsCallable(functions, "removeAdminRole");
  return await fn({ phoneNumber });
};
