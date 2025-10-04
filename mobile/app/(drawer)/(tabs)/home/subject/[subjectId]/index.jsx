import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Button, ScrollView, Text, View } from "react-native";

export default function Chapters() {
  const router = useRouter();
  const { subjectId } = useLocalSearchParams();

  const chapters = [
    { id: "chapter1", name: "Chapter 1" },
    { id: "chapter2", name: "Chapter 2" },
    { id: "chapter3", name: "Chapter 3" },
    { id: "chapter4", name: "Chapter 4" },
    { id: "chapter5", name: "Chapter 5" },
  ];

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        {subjectId} - Chapters
      </Text>
      {chapters.map((chapter) => (
        <View key={chapter.id} style={{ marginBottom: 15 }}>
          <Button
            title={chapter.name}
            onPress={() =>
              router.push(`home/subject/${subjectId}/${chapter.id}`)
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}
