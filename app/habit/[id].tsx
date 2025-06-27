import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HabitDetailScreen = () => {
  // Get the habit ID from the URL params
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Animation values
  const [scrollY] = useState(new Animated.Value(0));

  // Current date for calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock habit data - in a real app, you'd fetch this based on the ID
  const [habit, setHabit] = useState({
    id: id as string,
    name: "Morning Meditation",
    description: "Start each day with mindfulness",
    streak: 7,
    longestStreak: 14,
    completedToday: false,
    completionRate: 85,
    color: "#00D4AA", // Updated to match the green from the image
    icon: "🧘",
    completedDates: [
      "2025-06-23",
      "2025-06-22",
      "2025-06-20",
      "2025-06-19",
      "2025-06-25",
    ], // Sample completed dates
  });

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isFutureDate = (year, month, day) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    return checkDate > today;
  };

  const isCompleted = (year, month, day) => {
    const dateString = formatDate(year, month, day);
    return habit.completedDates.includes(dateString);
  };

  const toggleDateCompletion = (year, month, day) => {
    if (isFutureDate(year, month, day)) return;

    const dateString = formatDate(year, month, day);
    const newCompletedDates = [...habit.completedDates];

    if (newCompletedDates.includes(dateString)) {
      const index = newCompletedDates.indexOf(dateString);
      newCompletedDates.splice(index, 1);
    } else {
      newCompletedDates.push(dateString);
    }

    setHabit((prev) => ({
      ...prev,
      completedDates: newCompletedDates,
    }));
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderWeeklyProgress = () => {
    const today = new Date();
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    const weekDays = [];

    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);

      const isCompleted = habit.completedDates.includes(
        formatDate(day.getFullYear(), day.getMonth(), day.getDate())
      );

      weekDays.push(
        <View key={i} style={styles.weekDayContainer}>
          <Text style={styles.weekDayLabel}>{dayNames[i]}</Text>
          <TouchableOpacity
            style={[
              styles.weekDayDot,
              isCompleted && { backgroundColor: habit.color },
            ]}
            onPress={() =>
              toggleDateCompletion(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
              )
            }
          />
        </View>
      );
    }

    return <View style={styles.weeklyContainer}>{weekDays}</View>;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthNames = [
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
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarDays = [];

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Habit Card */}
        <View style={styles.habitCard}>
          <View style={styles.habitHeader}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitStreak}>{habit.streak} day streak</Text>
            </View>
            <View
              style={[
                styles.completionButton,
                habit.completedToday && styles.completedButton,
              ]}
            >
              {habit.completedToday ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <View style={styles.emptyCircle} />
              )}
            </View>
          </View>

          {renderWeeklyProgress()}
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
            <Text style={styles.statsValue}>{habit.completionRate}%</Text>
            <Text style={styles.statsLabel}>Success Rate</Text>
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
  habitName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 14,
    color: "#8E8E93",
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
  statsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
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
