import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const getTypeConfig = (type) => {
    const configs = {
      class: {
        color: COLORS.primary,
        bgColor: COLORS.primary + "15",
        icon: "🎓",
        label: "CLASS TEST",
      },
      subject: {
        color: "#4CAF50",
        bgColor: "#4CAF5015",
        icon: "📚",
        label: "SUBJECT TEST",
      },
      chapter: {
        color: "#FF9800",
        bgColor: "#FF980015",
        icon: "📖",
        label: "CHAPTER TEST",
      },
    };
    return configs[type] || configs.class;
  };

  if (!quiz) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading quiz details...</Text>
      </View>
    );
  }

  const config = getTypeConfig(quiz.type || type);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={[styles.iconBadge, { backgroundColor: config.bgColor }]}>
            <Text style={styles.iconText}>{config.icon}</Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: config.bgColor }]}>
            <Text style={[styles.typeBadgeText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{quiz.title}</Text>

        {quiz.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{quiz.description}</Text>
          </View>
        ) : null}
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Quiz Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>❓</Text>
            </View>
            <Text style={styles.statLabel}>Questions</Text>
            <Text style={styles.statValue}>{quiz.totalQuestions}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>⏱️</Text>
            </View>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{quiz.durationMinutes} min</Text>
          </View>
        </View>
      </View>

      {/* Instructions Card */}
      <View style={styles.instructionsCard}>
        <View style={styles.instructionsHeader}>
          <Text style={styles.instructionsIcon}>📋</Text>
          <Text style={styles.instructionsTitle}>Instructions</Text>
        </View>
        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>
              Read each question carefully before answering
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>
              Complete all questions within the time limit
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>
              You can review your answers after submission
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
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
          <Text style={styles.startButtonText}>Start Quiz</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          activeOpacity={0.8}
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
          <Text style={styles.historyButtonIcon}>📊</Text>
          <Text style={styles.historyButtonText}>View Past Attempts</Text>
        </TouchableOpacity>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  // Header Card
  headerCard: {
    backgroundColor: COLORS.white,
    padding: 24,
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 28,
  },
  typeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.textDark,
    marginBottom: 12,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  descriptionContainer: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: "500",
  },

  // Stats Card
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },

  // Instructions Card
  instructionsCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(25, 118, 210, 0.08)",
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  instructionsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  instructionBullet: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "bold",
    marginRight: 12,
    marginTop: 1,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    fontWeight: "500",
  },

  // Actions Container
  actionsContainer: {
    gap: 12,
  },
  startButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    marginRight: 10,
    letterSpacing: 0.2,
  },
  startButtonArrow: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  historyButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  historyButtonText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});
