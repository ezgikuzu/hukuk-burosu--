export const loadState = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(`edbm_${key}`);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultValue;
  }
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`edbm_${key}`, serializedState);
  } catch (err) {
    // Yazma hatalarını yoksay
  }
};
