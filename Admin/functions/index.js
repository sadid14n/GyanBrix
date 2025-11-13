import { setGlobalOptions } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";

setGlobalOptions({ maxInstances: 10 });

// ✅ Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * ✅ Make a user an admin (by phone number)
 * Only admins (or initial setup) can call this function.
 */
export const setAdminRole = onCall(
  { region: "asia-south1" },
  async (request) => {
    const context = request.auth;
    const phoneNumber = request.data.phoneNumber;

    if (!phoneNumber) {
      throw new Error("Phone number is required.");
    }

    // If no one is logged in, reject
    if (!context) {
      throw new Error("Not authenticated. Please login first.");
    }

    // ✅ Allow the first ever admin creation (bootstrap case)
    // Check if any admin exists already
    const listUsers = await admin.auth().listUsers();
    const existingAdmin = listUsers.users.find(
      (u) => u.customClaims && u.customClaims.role === "admin"
    );

    if (existingAdmin && context.token.role !== "admin") {
      throw new Error("Only admins can assign admin roles.");
    }

    try {
      const user = await admin.auth().getUserByPhoneNumber(phoneNumber);
      await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });

      logger.info(`✅ Admin role assigned to: ${phoneNumber}`);
      return { message: `${phoneNumber} is now an admin.` };
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }
);

/**
 * ✅ Remove admin role (by phone number)
 */
export const removeAdminRole = onCall(
  { region: "asia-south1" },
  async (request) => {
    const context = request.auth;
    const phoneNumber = request.data.phoneNumber;

    if (!context) {
      throw new Error("Not authenticated.");
    }

    if (context.token.role !== "admin") {
      throw new Error("Only admins can remove admin role.");
    }

    try {
      const user = await admin.auth().getUserByPhoneNumber(phoneNumber);
      await admin.auth().setCustomUserClaims(user.uid, { role: "user" });

      logger.info(`✅ Admin role removed from: ${phoneNumber}`);
      return { message: `${phoneNumber} is now a normal user.` };
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }
);
