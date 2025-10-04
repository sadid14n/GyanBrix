import { useLocalSearchParams } from "expo-router/build/hooks";
import { Text, View } from "react-native";

export default function ChapterContent() {
  const { subjectId, chapterId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {subjectId.toUpperCase()} - {chapterId.toUpperCase()}
      </Text>
      <Text style={{ marginTop: 20 }}>
        This is the content of {chapterId} from {subjectId}.
      </Text>
    </View>
  );
}
