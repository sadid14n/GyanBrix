import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../../constants/color";

export default function QuizResult() {
  const params = useLocalSearchParams();

  const {
    quizTitle = "",
    score = 0,
    correct = 0,
    wrong = 0,
    total = 0,
  } = params;

  // convert to numbers safely
  const totalNum = Number(total) || 0;
  const correctNum = Number(correct) || 0;
  const wrongNum = Number(wrong) || 0;

  // score is already percentage (0-100)
  const percentage = Number(score) || 0;

  const skipped = totalNum - correctNum - wrongNum;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{quizTitle}</Text>
        <Text style={styles.subtitle}>Your Quiz Result</Text>
      </View>

      {/* SCORE CARD */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreText}>Score: {percentage}%</Text>

        <Text style={styles.percentText}>{percentage}%</Text>

        <View style={styles.statsRow}>
          <Stat label="Correct" value={correctNum} color={COLORS.success} />
          <Stat label="Wrong" value={wrongNum} color={COLORS.danger} />
          <Stat label="Skipped" value={skipped} color={COLORS.warning} />
        </View>
      </View>

      {/* BACK */}
      <TouchableOpacity
        onPress={() => router.replace("/(drawer)/(tabs)/tests")}
        style={styles.backBtn}
      >
        <Text style={styles.backBtnText}>Back to Tests</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* SMALL STAT COMPONENT */
const Stat = ({ label, value, color }) => (
  <View style={{ alignItems: "center", marginHorizontal: 20 }}>
    <Text style={{ fontSize: 20, fontWeight: "700", color }}>{value}</Text>
    <Text style={{ fontSize: 14, color: "#444" }}>{label}</Text>
  </View>
);

/* STYLES */
const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: "#fff",
    opacity: 0.9,
    marginTop: 4,
    fontSize: 15,
  },
  scoreCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  percentText: {
    fontSize: 40,
    fontWeight: "800",
    color: COLORS.primary,
    marginVertical: 10,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  backBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
