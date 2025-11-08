import { setGlobalOptions } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";

// ✅ Limit function instances (optional cost control)
setGlobalOptions({ maxInstances: 10 });

// ✅ Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * ✅ Make a user an admin
 * Only existing admins can call this function.
 */
export const setAdminRole = onCall(async (request) => {
  const context = request.auth;
  const email = request.data.email;

  if (!context) {
    throw new Error("Not authenticated. Please login first.");
  }

  // ✅ Only admins can assign admin role
  if (context.token.role !== "admin") {
    throw new Error("Permission denied. Only admins can assign admin role.");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });

    logger.info(`✅ Admin role assigned to: ${email}`);

    return { message: `${email} is now an admin.` };
  } catch (error) {
    logger.error(error);
    throw new Error(error.message);
  }
});

/**
 * ✅ Remove admin role
 */
export const removeAdminRole = onCall(async (request) => {
  const context = request.auth;
  const email = request.data.email;

  if (!context) {
    throw new Error("Not authenticated.");
  }

  if (context.token.role !== "admin") {
    throw new Error("Only admins can remove admin role.");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().setCustomUserClaims(user.uid, { role: "user" });

    logger.info(`✅ Admin role removed from: ${email}`);

    return { message: `${email} is now a normal user.` };
  } catch (error) {
    logger.error(error);
    throw new Error(error.message);
  }
});
