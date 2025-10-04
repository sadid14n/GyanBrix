import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="subject/[subjectId]/index"
        options={({ route }) => ({
          title: route.params?.subjectName || "Subject",
        })}
      />
      <Stack.Screen
        name="subject/[subjectId]/[chapterId]"
        options={({ route }) => ({
          title: route.params?.chapterName || "Chapter",
        })}
      />
    </Stack>
  );
}
