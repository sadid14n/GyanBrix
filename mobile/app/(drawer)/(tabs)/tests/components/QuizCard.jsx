import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../../../constants/color";

export default function QuizCard({ quiz, onPress }) {
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

  const config = getTypeConfig(quiz.type);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
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

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>❓</Text>
          <Text style={styles.metaText}>{quiz.totalQuestions} Questions</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⏱️</Text>
          <Text style={styles.metaText}>{quiz.durationMinutes} min</Text>
        </View>
      </View>

      <View style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Test</Text>
        <Text style={styles.startButtonArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 24,
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
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 14,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  startButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
    letterSpacing: 0.2,
  },
  startButtonArrow: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
