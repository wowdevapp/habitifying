import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardProps {
  name: string;
  streak: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  isActive?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  name,
  streak,
  isCompleted,
  onToggleComplete,
  isActive = false,
}) => {
  // Days of the week
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.streak}>{streak} day streak</Text>
      </View>

      <TouchableOpacity
        style={[styles.checkButton, isCompleted && styles.completedButton]}
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
                index === 6 && styles.todayIndicator, // Assuming Sunday is today
              ]}
            />
          </View>
        ))}
      </View>
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
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
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "#00ff88",
    borderColor: "#00ff88",
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
