
const STORAGE_KEYS = {
  OPENAI_API_KEY: "tex-job-matchmaker-openai-key",
  GROQ_API_KEY: "tex-job-matchmaker-groq-key",
  PREFERRED_MODEL: "tex-job-matchmaker-preferred-model",
};

export const getStoredApiKey = (provider: 'openai' | 'groq' = 'openai'): string => {
  const key = provider === 'openai' ? STORAGE_KEYS.OPENAI_API_KEY : STORAGE_KEYS.GROQ_API_KEY;
  return localStorage.getItem(key) || "";
};

export const storeApiKey = (key: string, provider: 'openai' | 'groq' = 'openai'): void => {
  const storageKey = provider === 'openai' ? STORAGE_KEYS.OPENAI_API_KEY : STORAGE_KEYS.GROQ_API_KEY;
  localStorage.setItem(storageKey, key);
};

export const clearApiKey = (provider: 'openai' | 'groq' = 'openai'): void => {
  const key = provider === 'openai' ? STORAGE_KEYS.OPENAI_API_KEY : STORAGE_KEYS.GROQ_API_KEY;
  localStorage.removeItem(key);
};

export const getPreferredModel = (): 'openai' | 'groq' => {
  return (localStorage.getItem(STORAGE_KEYS.PREFERRED_MODEL) as 'openai' | 'groq') || 'openai';
};

export const storePreferredModel = (model: 'openai' | 'groq'): void => {
  localStorage.setItem(STORAGE_KEYS.PREFERRED_MODEL, model);
};
