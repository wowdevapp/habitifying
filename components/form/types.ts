export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: "day" | "week" | "month";
  goal: number;
  unit: string;
}

export type HabitFormData = Omit<Habit, "id">;

export interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habit: HabitFormData) => void;
}
