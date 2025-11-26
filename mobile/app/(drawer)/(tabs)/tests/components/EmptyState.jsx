import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../../../../constants/color";

export default function EmptyState({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.msg}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  msg: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
