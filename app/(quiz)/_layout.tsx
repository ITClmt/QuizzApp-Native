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
    </Stack>
  );
}
