import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View 
} from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { HabitFormData } from '../form/types';

interface FormInputProps {
  control: Control<HabitFormData>;
  name: keyof HabitFormData;
  label: string;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  optional?: boolean;
}

const FormInput = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  multiline = false, 
  numberOfLines = 1,
  optional = false
}: FormInputProps) => {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>{label}{optional ? ' (Optional)' : ''}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input, 
              multiline && styles.textArea
            ]}
            placeholder={placeholder}
            placeholderTextColor="#666"
            value={value as string}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
        )}
      />
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
});

export default FormInput;
