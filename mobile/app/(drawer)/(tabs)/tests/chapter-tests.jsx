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

import {
  getAllChapters,
  getAllSubjects,
} from "../../../../services/dataManager";
import { getChapterQuizzes } from "../../../../services/quizManager";
import { useAuth } from "../../../../services/userManager";
import QuizCard from "./components/QuizCard";

export default function ChapterTests() {
  const { profile } = useAuth();
  const classId = profile?.selectedClass;

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  const [quizzes, setQuizzes] = useState([]);

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
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
        Load chapters after subject select
  ---------------------------------------- */
  useEffect(() => {
    if (!classId || !selectedSubject) {
      setChapters([]);
      return;
    }

    setLoadingChapters(true);

    getAllChapters(classId, selectedSubject)
      .then(setChapters)
      .finally(() => setLoadingChapters(false));
  }, [selectedSubject, classId]);

  /* ----------------------------------------
        Load quizzes after chapter select
  ---------------------------------------- */
  useEffect(() => {
    if (!classId || !selectedSubject || !selectedChapter) {
      setQuizzes([]);
      return;
    }

    setLoadingQuizzes(true);

    getChapterQuizzes(classId, selectedSubject, selectedChapter)
      .then(setQuizzes)
      .finally(() => setLoadingQuizzes(false));
  }, [selectedChapter, selectedSubject, classId]);

  /* ----------------------------------------
        CLICK HANDLER
  ---------------------------------------- */
  const handleQuizPress = (quiz) => {
    if (!quiz?.id || !classId || !selectedSubject || !selectedChapter) {
      console.log("Missing params:", {
        quizId: quiz?.id,
        classId,
        selectedSubject,
        selectedChapter,
      });
      return;
    }

    router.push({
      pathname: "/(drawer)/(tabs)/tests/quiz-details",
      params: {
        quizId: quiz.id,
        classId,
        type: "chapter",
        subjectId: selectedSubject,
        chapterId: selectedChapter,
      },
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 15 }}>
        Chapter Tests
      </Text>

      {/* SUBJECT SELECT */}
      <Text style={styles.title}>Select Subject</Text>
      {loadingSubjects ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(val) => {
              setSelectedSubject(val);
              setSelectedChapter("");
              setQuizzes([]);
            }}
            style={styles.picker}
            dropdownIconColor="#6d28d9"
          >
            <Picker.Item label="Select subject" value="" />
            {subjects.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>
        </View>
      )}

      {/* CHAPTER SELECT */}
      {selectedSubject ? (
        <>
          <Text style={styles.title}>Select Chapter</Text>

          {loadingChapters ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedChapter}
                onValueChange={setSelectedChapter}
                style={styles.picker}
                dropdownIconColor="#6d28d9"
              >
                <Picker.Item label="Select chapter" value="" />
                {chapters.map((ch) => (
                  <Picker.Item key={ch.id} label={ch.title} value={ch.id} />
                ))}
              </Picker>
            </View>
          )}
        </>
      ) : null}

      {/* QUIZ LIST */}
      {loadingQuizzes ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : quizzes.length === 0 ? (
        selectedChapter ? (
          <Text style={{ marginTop: 20 }}>No quizzes available.</Text>
        ) : null
      ) : (
        quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={{
              ...quiz,
              type: "chapter",
              classId,
              subjectId: selectedSubject,
              chapterId: selectedChapter,
            }}
            onPress={() =>
              handleQuizPress({
                ...quiz,
                type: "chapter",
                classId,
                subjectId: selectedSubject,
                chapterId: selectedChapter,
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
    marginBottom: 10,
    paddingHorizontal: 6,
    paddingVertical: 4, // give vertical breathing room
    minHeight: 48, // ensures nothing gets cropped
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
