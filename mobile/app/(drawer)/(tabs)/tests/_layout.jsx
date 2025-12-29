import { Stack } from "expo-router";

export default function TestsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="class-tests" />
      <Stack.Screen name="subject-tests" />
      <Stack.Screen name="chapter-tests" />
      <Stack.Screen name="quiz-details" />
      <Stack.Screen name="attempt-quiz" />
      <Stack.Screen name="quiz-result" />
      <Stack.Screen name="attempt-history" />
    </Stack>
  );
}
