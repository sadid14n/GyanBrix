import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../../../constants/color";

export default function AttemptItem({ attempt, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{attempt.quizTitle}</Text>

      <View style={styles.row}>
        <Text style={styles.score}>
          {attempt.score}/{attempt.total}
        </Text>

        <Text
          style={[
            styles.badge,
            {
              backgroundColor:
                attempt.percentage >= 40
                  ? COLORS.success + "20"
                  : COLORS.danger + "20",
              color: attempt.percentage >= 40 ? COLORS.success : COLORS.danger,
            },
          ]}
        >
          {attempt.percentage >= 40 ? "PASSED" : "FAILED"}
        </Text>
      </View>

      <Text style={styles.meta}>Percentage: {attempt.percentage}%</Text>
      <Text style={styles.meta}>Time Taken: {attempt.timeTaken}</Text>
      <Text style={styles.meta}>
        Date: {new Date(attempt.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    marginHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  score: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontWeight: "700",
  },
  meta: {
    fontSize: 13,
    marginTop: 4,
    color: COLORS.textSecondary,
  },
});
