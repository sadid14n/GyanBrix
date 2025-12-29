import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../../../../constants/color";

export default function QuestionCard({ question, selectedOption, onSelect }) {
  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question.question}</Text>

      {question.options.map((opt, i) => {
        const isSelected = selectedOption === i;

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              isSelected && {
                backgroundColor: COLORS.primary + "15",
                borderColor: COLORS.primary,
              },
            ]}
            onPress={() => onSelect(i)}
          >
            <Text style={{ color: COLORS.textPrimary }}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  question: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
    color: COLORS.textPrimary,
  },
  option: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
});
