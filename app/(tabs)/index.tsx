import HabitForm from "@/components/HabitForm";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingAddButton } from "../../components/FloatingAddButton";
import { HabitCard } from "../../components/HabitCard";

// Define the Habit type
interface Habit {
  id: string;
  name: string;
  description: string;
  streak: number;
  isCompleted: boolean;
}

const HabitTrackerApp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Drink water",
      description: "Drink 8 glasses of water daily",
      streak: 5,
      isCompleted: true,
    },
    {
      id: "2",
      name: "Read",
      description: "Read for at least 30 minutes",
      streak: 12,
      isCompleted: true,
    },
    {
      id: "3",
      name: "Exercise",
      description: "Do a 30-minute workout",
      streak: 3,
      isCompleted: false,
    },
  ]);
  const [overallProgress, setOverallProgress] = useState(67); // Overall completion percentage

  const handleAddHabit = () => {
    console.log("Add habit pressed");
    setModalVisible(true);
  };

  const handleSaveHabit = () => {
    if (habitName.trim()) {
      // Create a new habit object
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitName,
        description: habitDescription,
        streak: 0,
        isCompleted: false,
      };

      // Add the new habit to the habits array
      setHabits([...habits, newHabit]);

      // Close the modal and reset form
      setModalVisible(false);
      setHabitName("");
      setHabitDescription("");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setHabitName("");
    setHabitDescription("");
  };

  // Function to toggle habit completion
  const handleToggleHabit = (habitId: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? { ...habit, isCompleted: !habit.isCompleted }
          : habit
      )
    );

    // Update overall progress
    calculateProgress();
  };

  // Calculate overall progress
  const calculateProgress = () => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter((habit) => habit.isCompleted).length;
    const percentage = Math.round((completedCount / habits.length) * 100);
    setOverallProgress(percentage);
  };

  // Calculate progress on initial render and when habits change
  useEffect(() => {
    calculateProgress();
  }, [habits]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Main Content Area */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Habits</Text>
        </View>

        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircleContainer}>
            {/* Background Circle */}
            <View style={styles.progressCircle}></View>

            {/* Progress Arc - This is a semi-transparent overlay to show progress */}
            <View
              style={[
                styles.progressArc,
                { transform: [{ rotate: `${overallProgress * 3.6}deg` }] },
              ]}
            ></View>

            {/* Inner Circle with Text */}
            <View style={styles.progressInnerCircle}>
              <Text style={styles.progressText}>{overallProgress}%</Text>
              <Text style={styles.progressLabel}>completed</Text>
            </View>
          </View>
        </View>

        {/* Habit Cards */}
        <ScrollView
          style={styles.habitsList}
          showsVerticalScrollIndicator={false}
        >
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              streak={habit.streak}
              isCompleted={habit.isCompleted}
              isActive={habit.name === "Read"} // Just for demo purposes
              onToggleComplete={() => handleToggleHabit(habit.id)}
            />
          ))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      {/* Floating Add Button */}
      <FloatingAddButton onPress={handleAddHabit} />

      {/* Add Habit Modal */}
      <HabitForm
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveHabit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 17,
    color: "#666666",
    marginBottom: 8,
    fontWeight: "400",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
  },
  habitsList: {
    flex: 1,
    marginTop: 20,
  },
  bottomPadding: {
    height: 80,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  progressCircleContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "#222",
    position: "absolute",
  },
  progressArc: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "#00ff88",
    position: "absolute",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "0deg" }],
  },
  progressInnerCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  progressLabel: {
    color: "#666666",
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#00ff88",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonTouchable: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    backgroundColor: "#00ff88",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 1,
    borderColor: "#00ff88",
    borderBottomWidth: 0,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "left",
  },
  formGroup: {
    marginBottom: 20,
  },
  weekdaysContainer: {
    marginBottom: 24,
  },
  weekdayButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  weekdayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  weekdayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#00ff88",
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#1a1a1a",
    opacity: 0.5,
    borderWidth: 1,
    borderColor: "#333",
  },
  saveButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default HabitTrackerApp;
