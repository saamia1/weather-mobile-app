import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, ImageBackground } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type WeatherScreenRouteProp = RouteProp<RootStackParamList, 'Weather'>;

type Props = {
  route: WeatherScreenRouteProp;
};

type ForecastItem = {
  dt: number;
  main: {
    temp: number;
  };
};

const WeatherScreen: React.FC<Props> = ({ route }) => {
  const { city } = route.params;
  const [temperature, setTemperature] = useState<string | null>(null);
  const [weatherDescription, setWeatherDescription] = useState<string | null>(null);
  const [humidity, setHumidity] = useState<string | null>(null);
  const [windSpeed, setWindSpeed] = useState<string | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching coordinates for city:', city);

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=86b8d0fb843082b16d0b7031e6fa4c65`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          throw new Error('No data found for the specified city');
        }
        const { lat, lon } = data[0];
        console.log('Coordinates:', { lat, lon });

        return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=86b8d0fb843082b16d0b7031e6fa4c65`);
      })
      .then(response => response.json())
      .then(data => {
        console.log('Weather data received:', data);
        setTemperature(data.main.temp);
        setWeatherDescription(data.weather[0].description);
        setHumidity(data.main.humidity);
        setWindSpeed(data.wind.speed);
        setLoading(false);

        return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=86b8d0fb843082b16d0b7031e6fa4c65`);
      })
      .then(response => response.json())
      .then(data => {
        console.log('Forecast data received:', data);
        setForecast(data.list.slice(0, 5));
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [city]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>{city}</Text>
        <Image source={require('../assets/icons/weather_icon.png')} style={styles.icon} />
        <Text style={styles.temperature}>{temperature}°C</Text>
        <Text style={styles.description}>{weatherDescription}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Image source={require('../assets/icons/humidity.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>Humidity: {humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Image source={require('../assets/icons/wind.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>Wind: {windSpeed} km/h</Text>
          </View>
        </View>
        <View style={styles.forecast}>
          <Text style={styles.forecastTitle}>Hourly Forecast</Text>
          <FlatList
            data={forecast}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.forecastItem}>
                <Text style={styles.forecastTime}>{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <Image source={require('../assets/icons/weather_icon.png')} style={styles.forecastIcon} />
                <Text style={styles.forecastTemp}>{item.main.temp}°C</Text>
              </View>
            )}
            keyExtractor={item => item.dt.toString()}
          />
        </View>
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
    padding: 10,
    backgroundColor: 'rgba(135, 206, 235, 0.5)', // Slightly transparent background to make the image more visible
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  temperature: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    color: '#000000',
    marginTop: 5,
    fontWeight: 'bold',
  },
  detailIcon: {
    width: 50,
    height: 50,
  },
  forecast: {
    paddingVertical: 20,
  },
  forecastTitle: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  forecastItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slightly transparent background for forecast items
    borderRadius: 10,
  },
  forecastTime: {
    color: '#000000',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  forecastTemp: {
    color: '#000000',
    marginTop: 5,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#000000',
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  forecastIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
});

export default WeatherScreen;
