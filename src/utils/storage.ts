
const STORAGE_KEYS = {
  OPENAI_API_KEY: "tex-job-matchmaker-openai-key",
};

export const getStoredApiKey = (): string => {
  return localStorage.getItem(STORAGE_KEYS.OPENAI_API_KEY) || "";
};

export const storeApiKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEYS.OPENAI_API_KEY, key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEYS.OPENAI_API_KEY);
};
