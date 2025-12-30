import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CalendarScreen from './CalendarScreen';
import TodoScreen from './TodoScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#777',    
      }}
    >
      <Tab.Screen name="Todo" component={TodoScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
    </Tab.Navigator>
  );
}
