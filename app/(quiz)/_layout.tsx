import { Stack } from "expo-router";

export default function QuizLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="preQuiz"
        options={{
          headerShown: false,
          title: "",
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{
          headerShown: false,
          title: "",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
