import { Tabs, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#096B72',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', height: 85, padding: 8,},
        tabBarLabelStyle: { marginTop: 13,}
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: focused ? 2 : 0,
            borderColor: focused ? '#096B72' : 'transparent',
          }}
        >
          <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={focused ? '#096B72' : color}
            />
        </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Sleep',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon-outline" size={22} color="#A0A3B1" />
          ),
        }}
      />
      <Tabs.Screen
        name="meditate"
        options={{
          title: 'Meditate',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={22} color="#A0A3B1" />
          ),
        }}
      />
      <Tabs.Screen
        name="music"
        options={{
          title: 'Music',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes-outline" size={22} color="#A0A3B1" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={22} color="#A0A3B1" />
          ),
        }}
      />
    </Tabs>
    </>
  );
}
