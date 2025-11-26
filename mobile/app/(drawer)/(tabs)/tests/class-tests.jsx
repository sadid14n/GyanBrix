import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";

import { getClassQuizzes } from "../../../../services/quizManager";
import { useAuth } from "../../../../services/userManager";
import QuizCard from "./components/QuizCard";

export default function ClassTests() {
  const { profile } = useAuth();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (profile?.selectedClass) {
      getClassQuizzes(profile.selectedClass).then(setQuizzes);
    }
  }, [profile?.selectedClass]);

  const handleQuizPress = (quiz) => {
    router.push({
      pathname: "/(drawer)/(tabs)/tests/quiz-details",
      params: {
        quizId: quiz.id,
        classId: quiz.classId,
        type: quiz.type,
      },
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 15 }}>
        Class Tests
      </Text>

      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onPress={() => handleQuizPress(quiz)}
        />
      ))}
    </ScrollView>
  );
}
