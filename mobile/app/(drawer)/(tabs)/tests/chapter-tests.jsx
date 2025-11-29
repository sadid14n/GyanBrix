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

import COLORS from "../../../../constants/color";
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>📖</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Chapter Tests</Text>
          <Text style={styles.headerSubtitle}>
            Select subject and chapter to begin
          </Text>
        </View>
      </View>

      {/* Subject Selector */}
      <View style={styles.selectorCard}>
        <View style={styles.selectorHeader}>
          <View style={styles.selectorIconBadge}>
            <Text style={styles.selectorIcon}>📚</Text>
          </View>
          <Text style={styles.selectorTitle}>Select Subject</Text>
        </View>

        {loadingSubjects ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading subjects...</Text>
          </View>
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSubject}
              onValueChange={(val) => {
                setSelectedSubject(val);
                setSelectedChapter("");
                setQuizzes([]);
              }}
              style={styles.picker}
              dropdownIconColor={COLORS.primary}
            >
              <Picker.Item label="Choose a subject..." value="" />
              {subjects.map((s) => (
                <Picker.Item key={s.id} label={s.name} value={s.id} />
              ))}
            </Picker>
          </View>
        )}
      </View>

      {/* Chapter Selector */}
      {selectedSubject ? (
        <View style={styles.selectorCard}>
          <View style={styles.selectorHeader}>
            <View style={styles.selectorIconBadge}>
              <Text style={styles.selectorIcon}>📑</Text>
            </View>
            <Text style={styles.selectorTitle}>Select Chapter</Text>
          </View>

          {loadingChapters ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading chapters...</Text>
            </View>
          ) : (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedChapter}
                onValueChange={(val) => {
                  setSelectedChapter(val);
                }}
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Choose a chapter..." value="" />
                {chapters.map((ch) => (
                  <Picker.Item key={ch.id} label={ch.title} value={ch.id} />
                ))}
              </Picker>
            </View>
          )}
        </View>
      ) : null}

      {/* Quiz List Section */}
      {selectedChapter && (
        <View style={styles.quizListSection}>
          <View style={styles.quizListHeader}>
            <Text style={styles.quizListTitle}>Available Tests</Text>
            {quizzes.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{quizzes.length}</Text>
              </View>
            )}
          </View>

          {loadingQuizzes ? (
            <View style={styles.centerLoadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading quizzes...</Text>
            </View>
          ) : quizzes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIconContainer}>
                <Text style={styles.emptyStateIcon}>📝</Text>
              </View>
              <Text style={styles.emptyStateText}>No tests available</Text>
              <Text style={styles.emptyStateSubtext}>
                Tests for this chapter will appear here once they are created
              </Text>
            </View>
          ) : (
            <View style={styles.quizList}>
              {quizzes.map((quiz) => (
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
              ))}
            </View>
          )}
        </View>
      )}

      {/* Initial Empty State */}
      {!selectedSubject && !loadingSubjects && (
        <View style={styles.initialEmptyState}>
          <View style={styles.emptyStateIconContainer}>
            <Text style={styles.emptyStateIcon}>🎯</Text>
          </View>
          <Text style={styles.emptyStateText}>Get Started</Text>
          <Text style={styles.emptyStateSubtext}>
            Select a subject above to view available chapters
          </Text>
        </View>
      )}

      {selectedSubject && !selectedChapter && !loadingChapters && (
        <View style={styles.initialEmptyState}>
          <View style={styles.emptyStateIconContainer}>
            <Text style={styles.emptyStateIcon}>📖</Text>
          </View>
          <Text style={styles.emptyStateText}>Choose a Chapter</Text>
          <Text style={styles.emptyStateSubtext}>
            Select a chapter above to view available tests
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 8,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.textDark,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "500",
    letterSpacing: 0.1,
  },

  // Selector Card Styles
  selectorCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(25, 118, 210, 0.08)",
  },
  selectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  selectorIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectorIcon: {
    fontSize: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.inputBackground,
    overflow: "hidden",
  },
  picker: {
    height: 56,
    color: COLORS.textDark,
  },

  // Loading States
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  centerLoadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  // Quiz List Section
  quizListSection: {
    marginTop: 8,
  },
  quizListHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  quizListTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  countBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  quizList: {
    gap: 0,
  },

  // Empty States
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 30,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  initialEmptyState: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 40,
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateIcon: {
    fontSize: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.textDark,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
});
