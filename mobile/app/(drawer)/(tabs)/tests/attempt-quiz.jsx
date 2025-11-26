import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../../constants/color";

import {
  evaluateQuiz,
  getQuizDetails,
  loadFullQuizQuestions,
  saveQuizAttempt,
} from "../../../../services/quizManager";

import { useAuth } from "../../../../services/userManager";

export default function AttemptQuiz() {
  const { quizId, classId, type, subjectId, chapterId } =
    useLocalSearchParams();

  const { user } = useAuth();

  const [quizMeta, setQuizMeta] = useState(null); // quiz details
  const [questions, setQuestions] = useState([]); // full questions
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef(null);

  const navigation = useNavigation();

  /* -----------------------------------------------
      🚫 BLOCK EXIT WHILE QUIZ IS RUNNING
  ----------------------------------------------- */

  /* --------------------------------------------------------
     🔥 Load quiz metadata + full questions
  -------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      const details = await getQuizDetails({
        quizId,
        classId,
        type,
        subjectId,
        chapterId,
      });

      if (!details) {
        Alert.alert("Error", "Quiz not found. (Invalid path)");
        router.back();
        return;
      }

      setQuizMeta(details);
      setTimeLeft(details.durationMinutes * 60); // Start timer

      const fullQs = await loadFullQuizQuestions(details);
      setQuestions(fullQs);

      setLoading(false);
    };

    loadData();
  }, []);

  /* --------------------------------------------------------
     ⏳ TIMER — Submit automatically when time expires
  -------------------------------------------------------- */
  useEffect(() => {
    if (!timeLeft) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 10;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // const selectOption = (questionId, optionKey) => {
  //   setAnswers((prev) => ({
  //     ...prev,
  //     [questionId]: optionKey,
  //   }));
  // };

  const selectOption = (questionId, optionKey) => {
    setAnswers((prev) => {
      const alreadySelected = prev[questionId] === optionKey;

      // If user taps again → deselect / clear
      if (alreadySelected) {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      }

      // Otherwise select
      return {
        ...prev,
        [questionId]: optionKey,
      };
    });
  };

  /* --------------------------------------------------------
     🔥 SUBMIT QUIZ
  -------------------------------------------------------- */
  const handleSubmit = async (auto = false) => {
    if (!auto) {
      const confirm = await new Promise((resolve) => {
        Alert.alert(
          "Submit Quiz?",
          "Are you sure you want to submit?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "Yes, Submit", onPress: () => resolve(true) },
          ],
          { cancelable: true }
        );
      });
      if (!confirm) return;
    }

    clearInterval(timerRef.current);

    const result = evaluateQuiz(questions, answers);

    await saveQuizAttempt(user.uid, quizMeta, result);

    // router.replace({
    //   pathname: "/(drawer)/(tabs)/tests/quiz-result",
    //   params: {
    //     quizTitle: quizMeta.title,
    //     score: result.score,
    //     correct: result.correct,
    //     wrong: result.wrong,
    //     total: result.total,
    //   },
    // });
    router.replace({
      pathname: "/(drawer)/(tabs)/tests/quiz-result",
      params: {
        quizTitle: quizMeta.title,
        score: result.score,
        correct: result.correct,
        wrong: result.wrong,
        skipped: result.skipped,
        total: result.total,
      },
    });
  };

  if (loading || questions.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading quiz...</Text>
      </View>
    );

  const q = questions[currentIndex];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View
        style={{
          padding: 16,
          backgroundColor: COLORS.primary,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          {quizMeta.title}
        </Text>

        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          ⏳ {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </Text>
      </View>

      {/* BODY */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
          Question {currentIndex + 1} / {questions.length}
        </Text>

        <Text style={{ fontSize: 17, marginBottom: 20 }}>{q.question}</Text>

        {["optionA", "optionB", "optionC", "optionD"].map((op) => {
          if (!q[op]) return null;

          const selected = answers[q.id] === op;

          return (
            <TouchableOpacity
              key={op}
              onPress={() => selectOption(q.id, op)}
              style={{
                padding: 14,
                borderRadius: 10,
                marginBottom: 12,
                backgroundColor: selected ? COLORS.primary + "20" : "#fff",
                borderWidth: 1,
                borderColor: selected ? COLORS.primary : "#ccc",
              }}
            >
              <Text>
                {op.replace("option", "")}. {q[op]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* FOOTER */}
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((i) => i - 1)}
          style={{
            padding: 14,
            backgroundColor: currentIndex === 0 ? "#ccc" : COLORS.primary,
            borderRadius: 10,
            width: "32%",
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Previous</Text>
        </TouchableOpacity>

        {currentIndex < questions.length - 1 ? (
          <TouchableOpacity
            onPress={() => setCurrentIndex((i) => i + 1)}
            style={{
              padding: 14,
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              width: "32%",
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleSubmit(false)}
            style={{
              padding: 14,
              backgroundColor: COLORS.success,
              borderRadius: 10,
              width: "32%",
            }}
          >
            <Text style={{ color: "#000", textAlign: "center" }}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
