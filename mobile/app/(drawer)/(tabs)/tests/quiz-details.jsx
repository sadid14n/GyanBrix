import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../../constants/color";
import { getQuizDetails } from "../../../../services/quizManager";

export default function QuizDetails() {
  const { quizId, classId, type, subjectId, chapterId } =
    useLocalSearchParams();

  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    getQuizDetails({
      quizId,
      classId,
      type,
      subjectId,
      chapterId,
    }).then(setQuiz);
  }, []);

  if (!quiz) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 6 }}>
        {quiz.title}
      </Text>

      <Text style={{ color: COLORS.textSecondary, marginBottom: 20 }}>
        {quiz.totalQuestions} Questions • {quiz.durationMinutes} min
      </Text>

      {quiz.description ? (
        <Text style={{ marginBottom: 20, color: COLORS.textPrimary }}>
          {quiz.description}
        </Text>
      ) : null}

      {/* ✅ Must pass subjectId & chapterId */}
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.primary,
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
        onPress={() =>
          router.push({
            pathname: "/(drawer)/(tabs)/tests/attempt-quiz",
            params: {
              quizId,
              classId,
              type,
              subjectId,
              chapterId,
            },
          })
        }
      >
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>
          Start Quiz
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          borderWidth: 1,
          borderColor: COLORS.primary,
        }}
        onPress={() =>
          router.push({
            pathname: "/(drawer)/(tabs)/tests/attempt-history",
            params: {
              quizId,
              classId,
              type,
              subjectId,
              chapterId,
            },
          })
        }
      >
        <Text
          style={{ fontSize: 16, fontWeight: "600", color: COLORS.primary }}
        >
          View Attempts
        </Text>
      </TouchableOpacity>
    </View>
  );
}
