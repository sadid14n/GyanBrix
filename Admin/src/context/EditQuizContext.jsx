import { createContext, useContext, useState } from "react";

const EditQuizContext = createContext(null);

export const useEditQuiz = () => useContext(EditQuizContext);

export const EditQuizProvider = ({ children }) => {
  const [quizEditingMode, setQuizEditingMode] = useState(null);
  /*
    quizEditingMode shape:
    {
      mode: "chapter" | "subject" | "class",
      quizData: {...full quiz object}
    }
  */

  const startEditing = (mode, quizData) => {
    setQuizEditingMode({ mode, quizData });
  };

  const clearEditing = () => setQuizEditingMode(null);

  return (
    <EditQuizContext.Provider
      value={{ quizEditingMode, startEditing, clearEditing }}
    >
      {children}
    </EditQuizContext.Provider>
  );
};
