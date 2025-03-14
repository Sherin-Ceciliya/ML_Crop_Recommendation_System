import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';

export default function Index() {
  const [form, setForm] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '',
  });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setRecommendation(null);
    try {
      const response = await fetch('http://172.20.10.4:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setRecommendation(result.recommended_crop);
    } catch (error) {
      setRecommendation('Failed to fetch recommendation');
      console.error("Error fetching recommendation:", error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>🌱 Crop Recommendation System</Text>

          {Object.keys(form).map((key) => (
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form[key as keyof typeof form]}
                onChangeText={(value) => handleChange(key, value)}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Fetching..." : "Get Recommendation"}</Text>
          </TouchableOpacity>

          {recommendation && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                {recommendation === "Failed to fetch recommendation" ? "❌" : "🌾"} {recommendation}
              </Text>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  scrollContainer: { padding: 20, paddingBottom: 80 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  resultText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});

