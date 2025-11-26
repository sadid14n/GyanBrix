import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";

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
    if (!selectedSubject) {
      setChapters([]);
      return;
    }

    setLoadingChapters(true);

    getAllChapters(classId, selectedSubject)
      .then(setChapters)
      .finally(() => setLoadingChapters(false));
  }, [selectedSubject]);

  /* ----------------------------------------
        Load quizzes after chapter select
  ---------------------------------------- */
  useEffect(() => {
    if (!selectedChapter) {
      setQuizzes([]);
      return;
    }

    setLoadingQuizzes(true);

    getChapterQuizzes(classId, selectedSubject, selectedChapter)
      .then(setQuizzes)
      .finally(() => setLoadingQuizzes(false));
  }, [selectedChapter]);

  /* ----------------------------------------
        CLICK HANDLER
  ---------------------------------------- */
  const handleQuizPress = (quiz) => {
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
      <Text>Select Subject</Text>
      {loadingSubjects ? (
        <ActivityIndicator size="large" />
      ) : (
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(val) => {
            setSelectedSubject(val);
            setSelectedChapter(""); // reset chapter
            setQuizzes([]);
          }}
        >
          <Picker.Item label="Select subject" value="" />
          {subjects.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      )}

      {/* CHAPTER SELECT */}
      {selectedSubject ? (
        <>
          <Text style={{ marginTop: 10 }}>Select Chapter</Text>

          {loadingChapters ? (
            <ActivityIndicator size="large" />
          ) : (
            <Picker
              selectedValue={selectedChapter}
              onValueChange={(val) => {
                setSelectedChapter(val);
              }}
            >
              <Picker.Item label="Select chapter" value="" />
              {chapters.map((ch) => (
                <Picker.Item key={ch.id} label={ch.title} value={ch.id} />
              ))}
            </Picker>
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
