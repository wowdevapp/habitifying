import { useLocalSearchParams, useRouter } from "expo-router";
import React, { ReactElement, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import the database directly
import dbData from "../../db.json";

// Define types for the JSON data structure
interface JsonHabit {
  id: string;
  name: string;
  description: string;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  color: string;
  icon: string;
  completedDates: string[];
  frequency: string;
  goal: number;
  unit?: string;
}

// Define types
interface HabitDetail {
  id: string;
  name: string;
  description: string;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  color: string;
  icon: string;
  completedDates: string[];
  frequency: "day" | "week" | "month";
  goal: number;
  unit?: string;
}

const HabitDetailScreen: React.FC = () => {
  // Get the habit ID from the URL params
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Animation values
  const [scrollY] = useState(new Animated.Value(0));

  // Current date for calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  // State for habit data
  const [habit, setHabit] = useState<HabitDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load habit data from the imported JSON
  useEffect(() => {
    try {
      setLoading(true);
      // Find the habit with matching ID
      const foundHabit = dbData.habits.find((h: JsonHabit) => h.id === id);

      if (foundHabit) {
        // Validate the frequency value before setting it
        const validFrequency = ["day", "week", "month"].includes(
          foundHabit.frequency
        )
          ? (foundHabit.frequency as "day" | "week" | "month")
          : "day";

        // Convert JsonHabit to HabitDetail with proper typing
        setHabit({
          ...foundHabit,
          frequency: validFrequency,
        });
      } else {
        setError(`Habit with ID ${id} not found`);
      }
    } catch (err) {
      setError("Failed to load habit data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Calendar helper functions
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isToday = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isFutureDate = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    return checkDate > today;
  };

  const isCompleted = (year: number, month: number, day: number): boolean => {
    if (!habit) return false;
    const dateString = formatDate(year, month, day);
    return habit.completedDates.includes(dateString);
  };

  const toggleDateCompletion = (
    year: number,
    month: number,
    day: number
  ): void => {
    if (!habit || isFutureDate(year, month, day)) return;

    const dateString = formatDate(year, month, day);
    const newCompletedDates = [...habit.completedDates];
    
    // Check if the date is already completed
    const dateIsCompleted = newCompletedDates.includes(dateString);
    
    // Toggle the completion status
    if (dateIsCompleted) {
      const index = newCompletedDates.indexOf(dateString);
      newCompletedDates.splice(index, 1);
    } else {
      newCompletedDates.push(dateString);
    }

    // Check if the toggled date is today
    const today = new Date();
    const isToday =
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate();
    
    // Update habit state with new completion status
    setHabit((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        completedDates: newCompletedDates,
        // If the toggled date is today, update completedToday accordingly
        completedToday: isToday ? !dateIsCompleted : prev.completedToday,
      };
    });
  };

  const navigateMonth = (direction: number): void => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendar = (): ReactElement | null => {
    if (!habit) return null;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthNames: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayNames: string[] = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

    const calendarDays: ReactElement[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const completed = isCompleted(year, month, day);
      const today = isToday(year, month, day);
      const future = isFutureDate(year, month, day);

      let dayStyle = [styles.calendarDay];
      let textStyle = [styles.calendarDayText];

      if (completed) {
        dayStyle.push({ backgroundColor: habit.color });
        textStyle.push({ color: "#000000", fontWeight: "700" });
      } else if (future) {
        dayStyle.push({ backgroundColor: "transparent" });
        textStyle.push({ color: "#444" });
      } else {
        dayStyle.push({ backgroundColor: "transparent" });
        textStyle.push({ color: "#888" });
      }

      if (today) {
        dayStyle.push({
          borderWidth: 2,
          borderColor: habit.color,
        });
        if (!completed) {
          textStyle.push({ color: habit.color });
        }
      }

      calendarDays.push(
        <TouchableOpacity
          key={day}
          style={dayStyle}
          onPress={() => toggleDateCompletion(year, month, day)}
          disabled={future}
        >
          <Text style={textStyle}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(-1)}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.monthTitle}>
            {monthNames[month]} {year}
          </Text>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(1)}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dayNamesContainer}>
          {dayNames.map((dayName) => (
            <Text key={dayName} style={styles.dayNameText}>
              {dayName}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>{calendarDays}</View>
      </View>
    );
  };

  // Render frequency text based on habit frequency
  const renderFrequencyText = (): string => {
    if (!habit) return "";

    switch (habit.frequency) {
      case "day":
        return "Daily Goal";
      case "week":
        return "Weekly Goal";
      case "month":
        return "Monthly Goal";
      default:
        return "Goal";
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4AA" />
          <Text style={styles.loadingText}>Loading habit details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !habit) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Habit not found"}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Habit Card */}
        <View
          style={[
            styles.habitCard,
            { borderLeftColor: habit?.color || "#00D4AA", borderLeftWidth: 4 },
          ]}
        >
          <View style={styles.habitHeader}>
            <View style={styles.habitInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text style={styles.habitName}>{habit.name}</Text>
              </View>
              <Text style={styles.habitDescription}>{habit.description}</Text>
              <Text style={styles.habitStreak}>{habit.streak} day streak</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.completionButton,
                habit.completedToday && styles.completedButton,
                {
                  backgroundColor: habit.completedToday
                    ? habit.color || "#00D4AA"
                    : "#2C2C2E",
                },
              ]}
              onPress={() => {
                const today = new Date();
                toggleDateCompletion(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );
              }}
            >
              {habit.completedToday ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <View style={styles.emptyCircle} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{habit.streak}</Text>
            <Text style={styles.statsLabel}>Current Streak</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{habit.longestStreak}</Text>
            <Text style={styles.statsLabel}>Best Streak</Text>
          </View>
          <View style={styles.statsCard}>
            <View style={styles.goalContainer}>
              <Text style={styles.statsValue}>{habit.goal}</Text>
              {habit.unit && <Text style={styles.unitText}>{habit.unit}</Text>}
            </View>
            <Text style={styles.statsLabel}>{renderFrequencyText()}</Text>
          </View>
        </View>

        {/* Full Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Monthly Progress</Text>
          {renderCalendar()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  habitCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  habitInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  habitName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  habitDescription: {
    fontSize: 14,
    color: "#AEAEB2",
    marginBottom: 8,
  },
  habitStreak: {
    fontSize: 14,
    color: "#8E8E93",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: "#2C2C2E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "#00D4AA",
  },
  checkmark: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#48484A",
  },
  weeklyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekDayContainer: {
    alignItems: "center",
  },
  weekDayLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
    fontWeight: "500",
  },
  weekDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2C2C2E",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  goalContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginLeft: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  calendarSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  calendarContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  dayNamesContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dayNameText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
    paddingVertical: 4,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
});

export default HabitDetailScreen;
