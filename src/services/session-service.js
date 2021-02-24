const saveFlashcardOrder = async (setId, shuffledFlashcards) => {
  sessionStorage.setItem(setId, JSON.stringify(shuffledFlashcards));
};

const getFlashcardOrder = async (setId) => {
  return JSON.parse(sessionStorage.getItem(setId)) || null;
};

const saveFlashcardProgress = async (setId, index) => {
  sessionStorage.setItem(`${setId}_p`, JSON.stringify(index));
};

const getFlashcardProgress = async (setId) => {
  return JSON.parse(sessionStorage.getItem(`${setId}_p`)) || null;
};

export default {
  saveFlashcardOrder,
  getFlashcardOrder,
  saveFlashcardProgress,
  getFlashcardProgress,
};
