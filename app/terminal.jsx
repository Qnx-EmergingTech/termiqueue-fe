import { useState, useEffect } from "react";
import { Text, View, Image, ScrollView, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Roboto_700Bold,
        });
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,           
          headerTitle: 'Please select a bus',              
          headerTransparent: false,      
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'Roboto_700Bold', 
            fontSize: 20,                                       
            },
        }}
      />

      <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
      >

      <View style={styles.container}>
        <View style={styles.welcome}>
            <Text style={styles.heading}>Terminal 1</Text>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/location.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Pacita</Text>
                    <Text style={styles.subtitle}>Already here</Text>
                </View>
            </View>
            </Pressable>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/location.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Pacita</Text>
                    <Text style={styles.subtitle}>Already here</Text>
                </View>
            </View>
            </Pressable>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/location.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Alabang</Text>
                    <Text style={styles.subtitle}>Already here</Text>
                </View>
            </View>
            </Pressable>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/location.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Binan</Text>
                    <Text style={styles.subtitle}>Already here</Text>
                </View>
            </View>
            </Pressable>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/bus.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Binan</Text>
                    <Text style={styles.subtitle}>20 mins away</Text>
                </View>
            </View>
            </Pressable>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/bus.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Alabang</Text>
                    <Text style={styles.subtitle}>40 mins away</Text>
                </View>
            </View>
            </Pressable>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/bus.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Pacita</Text>
                    <Text style={styles.subtitle}>45 mins away</Text>
                </View>
            </View>
            </Pressable>
            
            <Text style={styles.heading}>Terminal 2</Text>
            <Pressable onPress={() => router.push("/terminalModal")}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/location.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Alabang</Text>
                    <Text style={styles.subtitle}>Already here</Text>
                </View>
            </View>
            </Pressable>
        </View>
      </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',       
    alignItems: 'center',      
    padding: 20,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,            
  },
  textContainer: {
    flexDirection: 'column',   
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  heading: {
    fontSize: 34,
    fontFamily: "Roboto_700Bold",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
  }
});
