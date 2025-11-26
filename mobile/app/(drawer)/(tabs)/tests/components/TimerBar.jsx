import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../../../../constants/color";

export default function TimerBar({ timeLeft, totalTime }) {
  const progress = (timeLeft / totalTime) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${progress}%` }]} />
      <Text style={styles.time}>{timeLeft}s left</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ddd",
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 15,
  },
  bar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  time: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "700",
    color: "#fff",
  },
});
