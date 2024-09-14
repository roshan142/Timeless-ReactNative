import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Switch, StatusBar,Appearance } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import quotes from './assets/json/quotes.json';

SplashScreen.preventAutoHideAsync();

const loadFonts = () => {
  return Font.loadAsync({
    'BadUnicorn': require('./assets/fonts/BadUnicorn.ttf'),
    'MonainnRegular': require('./assets/fonts/MonainnRegular.otf')
  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(calculateSecondsLeft());
  const [currentQuote, setCurrentQuote] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');
  <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#000' : '#fff'} />


  // Function to calculate the remaining seconds of the day
  function calculateSecondsLeft() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set time to midnight
    const diff = (midnight - now) / 1000; // Difference in seconds
    return Math.floor(diff);
  }

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  const toggleSwitch = () => setIsDarkMode(prevState => !prevState);

  // Update the seconds left every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(calculateSecondsLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update the quote every 10 seconds
  useEffect(() => {
    setCurrentQuote(getRandomQuote());

    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 30000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null; // Don't render anything while fonts are loading
  }

  // Total seconds in a day
  const totalSecondsInADay = 24 * 60 * 60;

  // Calculate the percentage of the day that has passed
  const percentage = ((totalSecondsInADay - secondsLeft) / totalSecondsInADay) * 100;

  const getStrokeColor = () => {
    if (percentage < 50) {
      return '#3cb371'; // Green if below 50%
    } else if (percentage >= 50 && percentage < 80) {
      return '#FFA500'; // Orange if between 50% and 80%
    } else {
      return '#FF0000'; // Red if 80% or above
    }
  };

  const getEmoji = () => {
    if (percentage < 20) {
      return '😊';
    } else if (percentage >= 20 && percentage < 50) {
      return '😇';
    } else if (percentage >= 50 && percentage < 80) {
      return '🙂';
    } else if (percentage >= 80 && percentage < 90) {
      return '🥱';
    } else {
      return '😴';
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, display it as 12
    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
      <Text style={isDarkMode ? styles.darkTitle : styles.title}>TIMELESS</Text>
      <View style={styles.progressContainer}>
        <CircularProgress
          value={secondsLeft}
          radius={150}
          maxValue={totalSecondsInADay}
          title={`Day: ${Math.floor(percentage)}% ${getEmoji()}`}
          titleStyle={isDarkMode ? styles.darkCircleTitle : styles.circletitle}
          progressValueStyle={isDarkMode ? styles.darkProgressValue : styles.progressValue}
          valueSuffix={""}
          inActiveStrokeColor={'#d3d3d3'}
          inActiveStrokeOpacity={0.5}
          activeStrokeColor={getStrokeColor()}
          activeStrokeWidth={15}
          inActiveStrokeWidth={15}
          duration={0}
          rotation={0}
          startAngle={-90}
        />
        <View style={styles.switchContainer}>
          <Text style={isDarkMode ? styles.darkText : styles.text}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleSwitch}
            trackColor={{ false: '#767577', true: '#767577' }}
            thumbColor={isDarkMode ? getStrokeColor() : '#f4f3f4'}
          />
        </View>
        <Text style={isDarkMode ? styles.darkTime : styles.time}>
          {getCurrentTime()}
        </Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={isDarkMode ? styles.darkQuoteText : styles.quoteText}>
            {`"${currentQuote.quote}" -${currentQuote.author}`}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontFamily: 'MonainnRegular',
    marginTop: 40,
    fontSize: 80,
    color: '#222222',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  darkTitle: {
    fontFamily: 'MonainnRegular',
    marginTop: 40,
    fontSize: 80,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  circletitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  darkCircleTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  progressValue: {
    fontSize: 40,
    color: '#000000',
  },
  darkProgressValue: {
    fontSize: 40,
    color: '#ffffff',
  },
  quoteText: {
    fontFamily: 'BadUnicorn',
    marginTop: 20,
    fontSize: 50,
    color: '#333333',
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  darkQuoteText: {
    fontFamily: 'BadUnicorn',
    marginTop: 20,
    fontSize: 50,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  time: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 30,
    color: '#333333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  darkTime: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 30,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontSize: 18,
    color: '#000000',
  },
  darkText: {
    fontSize: 18,
    color: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 25,
  },
});

export default App;
