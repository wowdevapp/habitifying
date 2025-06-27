import React from "react";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HabitFormData } from "../form/types";

interface GoalSelectorProps {
  control: Control<HabitFormData>;
  watch: UseFormWatch<HabitFormData>;
  setValue: UseFormSetValue<HabitFormData>;
}

const GoalSelector = ({ control, watch, setValue }: GoalSelectorProps) => {
  const frequency = watch("frequency");
  const goal = watch("goal");

  return (
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>
        {frequency === "day"
          ? "Day Goal"
          : frequency === "week"
          ? "Week Goal"
          : "Month Goal"}
      </Text>
      <View style={styles.goalContainer}>
        <View style={styles.buttonsColumn}>
          <TouchableOpacity
            style={[styles.goalButton, styles.smallButton]}
            onPress={() => setValue("goal", Math.max(1, goal - 10))}
            disabled={goal <= 10}
          >
            <Text
              style={[
                styles.goalButtonText, styles.smallButtonText,
                goal <= 10 && styles.goalButtonDisabled,
              ]}
            >
              -10
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.goalButton, styles.smallButton]}
            onPress={() => setValue("goal", Math.max(1, goal - 5))}
            disabled={goal <= 5}
          >
            <Text
              style={[
                styles.goalButtonText, styles.smallButtonText,
                goal <= 5 && styles.goalButtonDisabled,
              ]}
            >
              -5
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.goalButton, styles.smallButton]}
            onPress={() => setValue("goal", Math.max(1, goal - 1))}
            disabled={goal <= 1}
          >
            <Text
              style={[
                styles.goalButtonText, styles.smallButtonText,
                goal <= 1 && styles.goalButtonDisabled,
              ]}
            >
              -1
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.goalValueContainer}>
          <Text style={styles.goalValue}>{goal}</Text>
          <Controller
            control={control}
            name="unit"
            render={({ field: { value } }) => (
              <Text style={styles.goalLabel}>
                {value
                  ? `${value}${goal > 1 ? "s" : ""} per ${frequency}`
                  : frequency === "day"
                  ? goal === 1
                    ? "time per day"
                    : "times per day"
                  : frequency === "week"
                  ? goal === 1
                    ? "time per week"
                    : "times per week"
                  : goal === 1
                  ? "time per month"
                  : "times per month"}
              </Text>
            )}
          />
        </View>

        <View style={styles.buttonsColumn}>
          <TouchableOpacity
            style={[styles.goalButton, styles.smallButton]}
            onPress={() => setValue("goal", goal + 1)}
            activeOpacity={0.7}
          >
            <Text style={[styles.goalButtonText, styles.smallButtonText]}>+1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.goalButton, styles.smallButton]}
            onPress={() => setValue("goal", goal + 5)}
            activeOpacity={0.7}
          >
            <Text style={[styles.goalButtonText, styles.smallButtonText]}>+5</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.goalButton, styles.smallButton]}
            onPress={() => setValue("goal", goal + 10)}
            activeOpacity={0.7}
          >
            <Text style={[styles.goalButtonText, styles.smallButtonText]}>+10</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 10,
  },
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonsColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 120,
  },
  goalButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  smallButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginVertical: 2,
  },
  goalButtonText: {
    color: "#00ff88",
    fontSize: 20,
    fontWeight: "700",
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  goalButtonDisabled: {
    color: "#555",
  },
  goalValueContainer: {
    flex: 1,
    alignItems: "center",
  },
  goalValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  goalLabel: {
    color: "#999",
    fontSize: 10,
    marginTop: 2,
    flexShrink: 1,
    textAlign: "center",
  },
});

export default GoalSelector;
