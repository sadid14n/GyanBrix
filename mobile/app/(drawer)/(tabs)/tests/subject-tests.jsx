import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";

import { getAllSubjects } from "../../../../services/dataManager";
import { getSubjectQuizzes } from "../../../../services/quizManager";
import { useAuth } from "../../../../services/userManager";
import QuizCard from "./components/QuizCard";

export default function SubjectTests() {
  const { profile } = useAuth();
  const classId = profile?.selectedClass;

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  /* ----------------------------------------
        Load subjects
  ---------------------------------------- */
  useEffect(() => {
    if (!classId) return;

    setLoadingSubjects(true);

    getAllSubjects(classId)
      .then(setSubjects)
      .finally(() => setLoadingSubjects(false));
  }, [classId]);

  /* ----------------------------------------
        Load quizzes of selected subject
  ---------------------------------------- */
  useEffect(() => {
    if (!selectedSubject) {
      setQuizzes([]);
      return;
    }

    setLoadingQuizzes(true);

    getSubjectQuizzes(classId, selectedSubject)
      .then(setQuizzes)
      .finally(() => setLoadingQuizzes(false));
  }, [selectedSubject]);

  /* ----------------------------------------
         CLICK HANDLER
  ---------------------------------------- */
  const handleQuizPress = (quiz) => {
    router.push({
      pathname: "/(drawer)/(tabs)/tests/quiz-details",
      params: {
        quizId: quiz.id,
        classId: quiz.classId,
        type: quiz.type,
        subjectId: quiz.subjectId || "",
        chapterId: quiz.chapterId || "",
      },
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 15 }}>
        Subject Tests
      </Text>

      <Text>Select Subject</Text>

      {loadingSubjects ? (
        <ActivityIndicator size="large" />
      ) : (
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(value) => setSelectedSubject(value)}
        >
          <Picker.Item label="Choose a Subject" value="" />
          {subjects.map((sub) => (
            <Picker.Item key={sub.id} label={sub.name} value={sub.id} />
          ))}
        </Picker>
      )}

      {/* QUIZ LIST */}
      {loadingQuizzes ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : quizzes.length === 0 ? (
        <Text style={{ marginTop: 20 }}>
          {selectedSubject
            ? "No quizzes available."
            : "Please select a subject."}
        </Text>
      ) : (
        quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={{
              ...quiz,
              type: "subject",
              classId,
              subjectId: selectedSubject,
              chapterId: quiz.chapterId || null, // subject-level quiz has no chapter
            }}
            onPress={() =>
              handleQuizPress({
                ...quiz,
                type: "subject",
                classId,
                subjectId: selectedSubject,
                chapterId: null,
              })
            }
          />
        ))
      )}
    </ScrollView>
  );
}
