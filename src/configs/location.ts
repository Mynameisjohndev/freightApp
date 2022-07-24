import RNLocation from 'react-native-location';

const time = 60 * 1000;
RNLocation.configure({
  // distanceFilter: 150, // Meters
  desiredAccuracy: {
    ios: 'best',
    android: 'highAccuracy',
  },
  // Android only
  androidProvider: 'auto',
  interval: time, // Milliseconds
  fastestInterval: time, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  activityType: 'other',
  allowsBackgroundLocationUpdates: false,
  headingFilter: 1, // Degrees
  headingOrientation: 'portrait',
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false,
});

export { RNLocation };
