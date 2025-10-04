import { useRouter } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "english", name: "English" },
  ];

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Subjects
      </Text>
      {subjects.map((s) => (
        <View key={s.id} style={{ marginVertical: 10 }}>
          <Button
            title={s.name}
            onPress={() =>
              router.push({
                pathname: `/home/subject/${s.id}`,
                params: { subjectName: s.name },
              })
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}
