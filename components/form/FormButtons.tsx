import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { UseFormWatch } from 'react-hook-form';
import { HabitFormData } from '../form/types';

interface FormButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  watch: UseFormWatch<HabitFormData>;
}

const FormButtons = ({ onCancel, onSubmit, watch }: FormButtonsProps) => {
  const habitName = watch('name');
  
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, !habitName.trim() && styles.saveButtonDisabled]}
        onPress={onSubmit}
        disabled={!habitName.trim()}
        activeOpacity={0.7}
      >
        <Text style={styles.saveButtonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default FormButtons;
