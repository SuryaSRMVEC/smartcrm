// src/utils/userStorage.js

// 1. Get the current logged-in user's email
export const getCurrentUserEmail = () => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    return user?.email ? user.email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
};

// 2. Generate a scoped key (e.g., "arun@test.com_crmDeals")
export const getUserKey = (baseKey) => {
  const email = getCurrentUserEmail();
  return email ? `${email}_${baseKey}` : baseKey;
};

// 3. Read data isolated to this user
export const getUserItem = (baseKey, fallback = []) => {
  try {
    const data = localStorage.getItem(getUserKey(baseKey));
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

// 4. Save data isolated to this user
export const setUserItem = (baseKey, data) => {
  localStorage.setItem(getUserKey(baseKey), JSON.stringify(data));
};