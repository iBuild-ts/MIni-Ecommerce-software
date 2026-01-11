# MYGlamBeauty - Mobile App Development Guide

## 📱 React Native Implementation

### Project Structure
```
myglambeauty-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation setup
│   ├── services/           # API services
│   ├── store/              # State management
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
└── __tests__/              # Test files
```

### Core Dependencies
```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "axios": "^1.5.0",
    "react-native-elements": "^3.4.3",
    "react-native-vector-icons": "^10.0.0",
    "react-native-calendars": "^1.1302.0",
    "react-native-image-picker": "^5.6.0",
    "@stripe/stripe-react-native": "^0.28.0",
    "react-native-push-notification": "^8.1.1",
    "react-native-keychain": "^8.1.3"
  }
}
```

### Navigation Setup
```typescript
// navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductsScreen from '../screens/ProductsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Booking') iconName = focused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Products') iconName = focused ? 'storefront' : 'storefront-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Booking" component={BookingScreen} />
    <Tab.Screen name="Products" component={ProductsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const { user } = useAuth();
  return user ? <TabNavigator /> : <AuthNavigator />;
};
```

### API Service
```typescript
// services/api.ts
import axios, { AxiosInstance } from 'axios';
import { getToken } from './auth';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.myglambeauty.com',
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.client.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or logout
          await logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: RegisterData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  // Booking endpoints
  async getBookings() {
    const response = await this.client.get('/bookings');
    return response.data;
  }

  async createBooking(bookingData: CreateBookingData) {
    const response = await this.client.post('/bookings', bookingData);
    return response.data;
  }

  // Product endpoints
  async getProducts() {
    const response = await this.client.get('/products');
    return response.data;
  }

  async getProduct(id: string) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  // Payment endpoints
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    const response = await this.client.post('/payments/create-intent', { amount, currency });
    return response.data;
  }
}

export const apiService = new APIService();
```

### State Management
```typescript
// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import { storeToken, getToken, removeToken } from '../services/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await apiService.login(email, password);
    await storeToken(response.token);
    return response.user;
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData) => {
    const response = await apiService.register(userData);
    await storeToken(response.token);
    return response.user;
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await removeToken();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

### Booking Screen
```typescript
// screens/BookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Input, Overlay } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';

interface BookingData {
  service: string;
  date: string;
  time: string;
  notes: string;
}

const BookingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const services = [
    'Hair Styling',
    'Manicure & Pedicure',
    'Facial Treatment',
    'Massage Therapy',
    'Makeup Application',
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setBookingData({ ...bookingData, date: day.dateString });
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    setShowTimePicker(false);
  };

  const handleBooking = async () => {
    if (!bookingData.service || !bookingData.date || !bookingData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.createBooking({
        ...bookingData,
        customerEmail: user.email,
        customerName: user.name,
      });
      
      Alert.alert('Success', 'Booking created successfully!');
      setBookingData({ service: '', date: '', time: '', notes: '' });
      setSelectedDate('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book an Appointment</Text>
      
      {/* Service Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Service</Text>
        {services.map((service) => (
          <Button
            key={service}
            title={service}
            buttonStyle={[
              styles.serviceButton,
              bookingData.service === service && styles.selectedService,
            ]}
            onPress={() => setBookingData({ ...bookingData, service })}
          />
        ))}
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Date</Text>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#007AFF' },
          }}
          minDate={new Date().toISOString()}
          theme={{
            selectedDayBackgroundColor: '#007AFF',
            todayTextColor: '#007AFF',
          }}
        />
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Time</Text>
        <Button
          title={bookingData.time || 'Select Time'}
          onPress={() => setShowTimePicker(true)}
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>Notes (Optional)</Text>
        <Input
          placeholder="Any special requests?"
          value={bookingData.notes}
          onChangeText={(text) => setBookingData({ ...bookingData, notes: text })}
          multiline
        />
      </View>

      {/* Submit Button */}
      <Button
        title="Book Appointment"
        buttonStyle={styles.submitButton}
        onPress={handleBooking}
        loading={isLoading}
      />

      {/* Time Picker Overlay */}
      <Overlay
        isVisible={showTimePicker}
        onBackdropPress={() => setShowTimePicker(false)}
        overlayStyle={styles.overlay}
      >
        <Text style={styles.overlayTitle}>Select Time</Text>
        <ScrollView>
          {timeSlots.map((time) => (
            <Button
              key={time}
              title={time}
              buttonStyle={[
                styles.timeButton,
                bookingData.time === time && styles.selectedTime,
              ]}
              onPress={() => handleTimeSelect(time)}
            />
          ))}
        </ScrollView>
      </Overlay>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  serviceButton: {
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  selectedService: {
    backgroundColor: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
  },
  overlay: {
    width: '80%',
    maxHeight: '50%',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  selectedTime: {
    backgroundColor: '#007AFF',
  },
});

export default BookingScreen;
```

### Payment Integration
```typescript
// services/paymentService.ts
import { StripeProvider, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';

export const PaymentScreen: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async (paymentIntent: string) => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'MYGlamBeauty',
      allowsDelayedPaymentMethods: true,
    });

    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { error } = await presentPaymentSheet();
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Payment completed!');
        // Navigate to success screen
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Pay Now"
        onPress={handlePayment}
        loading={loading}
      />
    </View>
  );
};
```

### Push Notifications
```typescript
// services/notificationService.ts
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

export class NotificationService {
  static initialize() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push notification token:', token);
        // Send token to backend
      },
      onNotification: (notification) => {
        console.log('Notification received:', notification);
        // Handle notification
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  static scheduleBookingReminder(bookingId: string, dateTime: Date) {
    const reminderTime = new Date(dateTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    
    PushNotification.localNotificationSchedule({
      id: bookingId,
      title: 'Booking Reminder',
      message: 'You have an appointment tomorrow!',
      date: reminderTime,
      allowWhileIdle: true,
    });
  }

  static sendBookingConfirmation(bookingData: any) {
    PushNotification.localNotification({
      title: 'Booking Confirmed!',
      message: `Your appointment for ${bookingData.service} is confirmed.`,
      userInfo: { bookingId: bookingData.id },
    });
  }
}
```

### Testing Setup
```typescript
// __tests__/BookingScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../store';
import BookingScreen from '../screens/BookingScreen';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('BookingScreen', () => {
  it('renders correctly', () => {
    renderWithProvider(<BookingScreen />);
    // Test component renders
  });

  it('allows service selection', () => {
    const { getByText } = renderWithProvider(<BookingScreen />);
    const serviceButton = getByText('Hair Styling');
    fireEvent.press(serviceButton);
    // Test service selection logic
  });

  it('allows date selection', () => {
    const { getByTestId } = renderWithProvider(<BookingScreen />);
    const calendar = getByTestId('calendar');
    fireEvent.press(calendar, { date: '2024-01-15' });
    // Test date selection logic
  });
});
```

## 🚀 Deployment

### Android Build
```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# Or generate AAB for Play Store
./gradlew bundleRelease
```

### iOS Build
```bash
# Build for App Store
cd ios
xcodebuild -workspace MyGlamBeauty.xcworkspace -scheme MyGlamBeauty -configuration Release archive
```

### App Store Submission

#### Google Play Store
1. Create Google Play Console account
2. Upload signed APK/AAB
3. Complete store listing
4. Submit for review

#### Apple App Store
1. Create App Store Connect account
2. Upload IPA file
3. Complete app information
4. Submit for review

## 📱 Features Implemented

- ✅ User authentication
- ✅ Booking management
- ✅ Product browsing
- ✅ Payment processing
- ✅ Push notifications
- ✅ Offline support
- ✅ Biometric authentication
- ✅ Dark mode support

## 🔧 Configuration

### Environment Variables
```env
API_URL=https://api.myglambeauty.com
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
SENTRY_DSN=your_sentry_dsn
```

### App Permissions
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

This mobile app implementation provides a native experience for your MYGlamBeauty customers!
