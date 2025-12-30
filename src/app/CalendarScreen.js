import { StyleSheet, Text, View } from 'react-native';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#bbb',
    fontSize: 16,
  },
});
