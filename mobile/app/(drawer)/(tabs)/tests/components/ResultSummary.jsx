import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../../../../constants/color";

export default function ResultSummary({ score, total, percentage }) {
  return (
    <View style={styles.box}>
      <Text style={styles.header}>Your Result</Text>

      <Text style={styles.score}>
        {score}/{total}
      </Text>

      <Text style={styles.percent}>{percentage}%</Text>

      <Text
        style={[
          styles.status,
          {
            color: percentage >= 40 ? COLORS.success : COLORS.danger,
          },
        ]}
      >
        {percentage >= 40 ? "PASSED" : "FAILED"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  score: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: "800",
  },
  percent: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "600",
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
  },
});
