import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardProps {
  id: string;
  name: string;
  streak: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  isActive?: boolean;
  color?: string;
  icon?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  id,
  name,
  streak,
  isCompleted,
  onToggleComplete,
  isActive = false,
  color = "#00ff88",
  icon = "📝",
}) => {
  const router = useRouter();

  const handleCardPress = () => {
    router.push(`/habit/${id}`);
  };
  // Days of the week
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
        { borderColor: color || "#333" },
      ]}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{name}</Text>
        </View>
        <Text style={styles.streak}>{streak} day streak</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.checkButton,
          { borderColor: color },
          isCompleted && { backgroundColor: color },
        ]}
        onPress={onToggleComplete}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.weekContainer}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayText}>{day}</Text>
            <View
              style={[
                styles.dayIndicator,
                true && styles.completedDay,
                true && { backgroundColor: color },
                index === 6 && styles.todayIndicator, // Assuming Sunday is today
              ]}
            />
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: "relative",
    borderWidth: 1,
    borderColor: "#333",
  },
  activeContainer: {
    borderColor: "#00ff88",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
  },
  contentContainer: {
    flexDirection: "column",
    marginBottom: 16,
    paddingRight: 50,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  streak: {
    fontSize: 14,
    color: "#666666",
  },
  checkButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "",
    borderColor: "",
  },
  checkmark: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayColumn: {
    alignItems: "center",
    width: 24,
  },
  dayText: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 6,
  },
  dayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  completedDay: {
    backgroundColor: "#00ff88",
  },
  todayIndicator: {
    borderWidth: 1,
    borderColor: "#ffffff",
  },
});
