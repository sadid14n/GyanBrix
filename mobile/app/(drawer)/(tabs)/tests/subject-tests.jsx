import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    if (!classId || !selectedSubject) {
      setQuizzes([]);
      return;
    }

    setLoadingQuizzes(true);

    getSubjectQuizzes(classId, selectedSubject)
      .then(setQuizzes)
      .finally(() => setLoadingQuizzes(false));
  }, [selectedSubject, classId]);

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
      <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 15 }}>
        SUBJECT QUIZZES
      </Text>

      {/* SUBJECT PICKER */}
      <Text style={styles.title}>Select Subject</Text>

      {loadingSubjects ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(value) => setSelectedSubject(value)}
            style={styles.picker}
            dropdownIconColor="#6d28d9"
          >
            <Picker.Item label="Choose a Subject" value="" />
            {subjects.map((sub) => (
              <Picker.Item key={sub.id} label={sub.name} value={sub.id} />
            ))}
          </Picker>
        </View>
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

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#6d28d9",
    borderRadius: 12,
    backgroundColor: "#eee5ff",
    marginTop: 6,

    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 48,
  },

  picker: {
    color: "#6d28d9",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 15,
    color: "#6d28d9",
  },
});
