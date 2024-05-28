import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

const HomeScreen = () => {
  const [city, setCity] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (city.trim()) {
      navigation.navigate('Weather', { city });
    } else {
      Alert.alert('Please enter a valid city name');
    }
  };

  return (
    <ImageBackground source={require('../assets/initial_background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>City Skies</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Adding shadow to the text
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    color: '#000',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#2596be', // Button color similar to the image
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Adding shadow to the text
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default HomeScreen;
