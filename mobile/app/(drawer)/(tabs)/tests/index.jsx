import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import COLORS from "../../../../constants/color";

export default function TestHome() {
  const Card = ({ title, description, path }) => (
    <TouchableOpacity
      onPress={() => router.push(path)}
      style={{
        backgroundColor: "#fff",
        padding: 20,
        marginVertical: 10,
        borderRadius: 12,
        elevation: 3,
      }}
    >
      <Text
        style={{ fontSize: 20, fontWeight: "800", color: COLORS.textPrimary }}
      >
        {title}
      </Text>
      <Text style={{ marginTop: 6, fontSize: 14, color: COLORS.textSecondary }}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "900", marginBottom: 20 }}>
        Tests
      </Text>

      <Card
        title="Class Tests"
        description="Full class-level mock tests"
        path="/(drawer)/(tabs)/tests/class-tests"
      />

      <Card
        title="Subject Tests"
        description="Select subject to start test"
        path="/(drawer)/(tabs)/tests/subject-tests"
      />

      <Card
        title="Chapter Tests"
        description="Select subject & chapter"
        path="/(drawer)/(tabs)/tests/chapter-tests"
      />
    </ScrollView>
  );
}
