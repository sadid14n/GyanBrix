import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../../../constants/color";

export default function QuizCard({ quiz, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{quiz.title}</Text>

      <Text style={styles.meta}>
        {/* {quiz.totalQuestions} Questions • {quiz.durationMinutes} min */}
      </Text>

      <View
        style={[
          styles.badge,
          {
            backgroundColor:
              quiz.type === "class"
                ? COLORS.primary + "15"
                : quiz.type === "subject"
                ? COLORS.success + "15"
                : COLORS.warning + "15",
          },
        ]}
      >
        <Text
          style={{
            color:
              quiz.type === "class"
                ? COLORS.primary
                : quiz.type === "subject"
                ? COLORS.success
                : COLORS.warning,
            fontWeight: "700",
          }}
        >
          {quiz.type.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  meta: {
    marginTop: 6,
    color: COLORS.textSecondary,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
