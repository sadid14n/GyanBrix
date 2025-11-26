import { router } from "expo-router";
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
import { getUserAttempts } from "../../../../services/quizManager";
import { useAuth } from "../../../../services/userManager";

export default function AttemptHistory() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getUserAttempts(user.uid);
        setAttempts(data);
      } catch (err) {
        console.error("Error fetching attempts:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Loading history...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F8F9FC" }}>
      <Text style={styles.header}>Your Quiz Attempts</Text>

      {attempts.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>
            No attempts yet.
          </Text>
        </View>
      ) : (
        attempts.map((a) => {
          const percentage = a.score; // score already %
          const dateString = a.createdAt
            ? a.createdAt.toDate().toLocaleString()
            : "N/A";

          return (
            <TouchableOpacity
              key={a.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(drawer)/(tabs)/tests/quiz-result",
                  params: {
                    quizTitle: a.quizTitle,
                    score: a.score,
                    total: a.totalQuestions,
                    correct: a.correct,
                    wrong: a.wrong,
                    percentage: a.score,
                    review: JSON.stringify(a.detailed),
                    timeTaken: a.timeTaken || "N/A",
                  },
                })
              }
            >
              <Text style={styles.quizTitle}>{a.quizTitle}</Text>

              <View style={styles.row}>
                <Text style={styles.scoreText}>
                  {a.correct}/{a.totalQuestions}
                </Text>

                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        percentage >= 40
                          ? COLORS.success + "20"
                          : COLORS.danger + "20",
                      color: percentage >= 40 ? COLORS.success : COLORS.danger,
                    },
                  ]}
                >
                  {percentage >= 40 ? "PASSED" : "FAILED"}
                </Text>
              </View>

              <Text style={styles.percent}>Percentage: {percentage}%</Text>
              <Text style={styles.metaText}>Date: {dateString}</Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontWeight: "700",
    overflow: "hidden",
  },
  percent: {
    marginTop: 6,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  metaText: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  center: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
