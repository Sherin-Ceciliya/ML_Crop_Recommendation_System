import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { API_URL } from "../constants/api";

const App = () => {
    const [inputs, setInputs] = useState({
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: ""
    });
    const [result, setResult] = useState("");

    const handleChange = (name, value) => {
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${API_URL}/predict`, {
                N: parseFloat(inputs.N),
                P: parseFloat(inputs.P),
                K: parseFloat(inputs.K),
                temperature: parseFloat(inputs.temperature),
                humidity: parseFloat(inputs.humidity),
                ph: parseFloat(inputs.ph),
                rainfall: parseFloat(inputs.rainfall),
            });

            setResult(response.data.recommended_crop);
        } catch (error) {
            console.error("Error fetching prediction:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crop Recommendation</Text>
            {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map((field) => (
                <TextInput
                    key={field}
                    style={styles.input}
                    placeholder={field}
                    keyboardType="numeric"
                    onChangeText={(value) => handleChange(field, value)}
                    value={inputs[field]}
                />
            ))}
            <Button title="Get Recommendation" onPress={handleSubmit} />
            {result ? <Text style={styles.result}>Recommended Crop: {result}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold",
        color: "green",
    },
});

export default App;
