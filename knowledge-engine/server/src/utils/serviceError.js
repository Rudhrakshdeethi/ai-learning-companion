export const formatServiceError = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage;
  }

  if (error.status === 429) {
    return "An LLM provider hit a quota or rate limit. The system will fall back when possible, but you may need to check your provider keys.";
  }

  return error.message || fallbackMessage;
};
