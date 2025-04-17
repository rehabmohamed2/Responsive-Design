import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  colors,
  defaultStyle,
  formHeading,
  inputOptions,
  inputStyle,
} from '../../styles/styles';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import LottieView from "lottie-react-native";
import { MaterialIcons } from 'react-native-vector-icons';

const { width } = Dimensions.get('window');

// Use this for a simple demo instead of AsyncStorage
let registeredUser = null;

// Function to set user data when signing up (called from SignupScreen)
export const setRegisteredUser = (userData) => {
  registeredUser = userData;
};

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showConstraints, setShowConstraints] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateEmail = (text) => {
    setEmail(text);
    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address (example@domain.com)');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    
    // Create an array to hold all specific validation issues
    const issues = [];
    
    if (!text) {
      setPasswordError('Password is required');
    } else {
      if (text.length < 6) {
        issues.push('at least 6 characters');
      }
      if (!/(?=.*[A-Z])/.test(text)) {
        issues.push('one uppercase letter');
      }
      if (!/(?=.*\d)/.test(text)) {
        issues.push('one number');
      }
      
      if (issues.length > 0) {
        setPasswordError(`Password must contain ${issues.join(', ')}`);
      } else {
        setPasswordError('');
      }
    }
  };

  const submitHandler = () => {
    // Validate both fields before submission
    validateEmail(email);
    validatePassword(password);
    
    // Collect all error messages
    const errors = [];
    if (emailError || !email) errors.push(emailError || 'Email is required');
    if (passwordError || !password) errors.push(passwordError || 'Password is required');
    
    // Only proceed if there are no errors
    if (errors.length === 0) {
      setLoading(true);
      
      // Check if the user exists in our simple "database"
      if (registeredUser && registeredUser.email === email && registeredUser.password === password) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Login Successful!',
          text2: 'You have successfully logged in.',
          visibilityTime: 3000,
          autoHide: true,
        });
        
        // For testing, you can also use hardcoded test credentials:
        // if ((email === "test@example.com" && password === "Test123") || 
        //     (registeredUser && registeredUser.email === email && registeredUser.password === password)) {
        
        setLoading(false);
        navigation.navigate('Main');
      } else {
        setLoading(false);
        // Show invalid credentials error
        setErrorMessages(['Invalid email or password. Please try again.']);
        setShowErrorModal(true);
      }
    } else {
      // Show custom error modal
      setErrorMessages(errors);
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <View style={{ ...defaultStyle, backgroundColor: colors.color2 }}>
        {/* Heading */}
        <View style={{ marginBottom: 20 }}>
          <Text style={formHeading}>Login</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.container}>
          <View style={styles.lottieWrapper}>
            <LottieView
              source={require("../assets/Cart.json")} 
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <TextInput
              {...inputOptions}
              placeholder='Email'
              value={email}
              onChangeText={validateEmail}
              keyboardType='email-address'
              onFocus={() => setShowConstraints(true)}
              error={Boolean(emailError)}
              style={[
                inputOptions.style,
                emailError ? styles.inputError : {}
              ]}
              theme={{ 
                colors: { 
                  error: 'red',
                  primary: emailError ? 'red' : colors.color1,
                  background: emailError ? 'rgba(255, 0, 0, 0.05)' : 'white'
                } 
              }}
              right={
                <TextInput.Icon 
                  icon="information-outline" 
                  color={emailError ? 'red' : colors.color1}
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Email Format',
                      text2: 'Enter a valid email address (e.g., example@domain.com)',
                      position: 'bottom',
                    });
                  }}
                />
              }
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : 
              <Text style={styles.constraintText}>Format: example@domain.com</Text>
            }
          </View>
          
          {/* Password Field */}
          <View style={styles.inputContainer}>
            <TextInput
              {...inputOptions}
              placeholder='Password'
              value={password}
              secureTextEntry={true}
              onChangeText={validatePassword}
              onFocus={() => setShowConstraints(true)}
              error={Boolean(passwordError)}
              style={[
                inputOptions.style,
                passwordError ? styles.inputError : {}
              ]}
              theme={{ 
                colors: { 
                  error: 'red',
                  primary: passwordError ? 'red' : colors.color1,
                  background: passwordError ? 'rgba(255, 0, 0, 0.05)' : 'white'
                } 
              }}
              right={
                <TextInput.Icon 
                  icon="information-outline" 
                  color={passwordError ? 'red' : colors.color1}
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Password Requirements',
                      text2: 'Minimum 6 characters, at least 1 uppercase letter and 1 number',
                      position: 'bottom',
                    });
                  }}
                />
              }
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : 
              showConstraints && (
                <Text style={styles.constraintText}>
                  Minimum 6 characters, at least 1 uppercase letter and 1 number
                </Text>
              )
            }
          </View>
          
          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={() => navigation.navigate('forgetpassword')}
          >
            <Text style={styles.forget}>Forget Password</Text>
          </TouchableOpacity>

          <Button
            style={styles.btn}
            textColor={colors.color7}
            onPress={submitHandler}
            loading={loading}
          >
            Log In
          </Button>

          <Text style={styles.or}>OR</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SignupScreen')}
          >
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>

      {/* Custom Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="error-outline" size={30} color={colors.color1} />
              <Text style={styles.modalTitle}>Validation Error</Text>
            </View>
            
            <View style={styles.modalBody}>
              {errorMessages.map((error, index) => (
                <View key={index} style={styles.errorItem}>
                  <MaterialIcons name="error" size={20} color={colors.color1} style={{marginRight: 10}} />
                  <Text style={styles.modalErrorText}>{error}</Text>
                </View>
              ))}
            </View>
            
            <Button 
              style={styles.modalButton}
              textColor="#fff"
              onPress={() => setShowErrorModal(false)}
            >
              OK
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Make background semi-transparent
    borderRadius: 10,
    justifyContent: 'center',
    elevation: 0,
  },
  inputContainer: {
    marginBottom: 15,
  },
  forget: {
    color: colors.color7,
    marginHorizontal: 20,
    marginBottom: 10,
    alignSelf: 'flex-end',
    fontWeight: '100',
  },
  btn: {
    backgroundColor: colors.color1,
    fontWeight: 'bold',
    margin: 20,
    padding: 5,
  },
  or: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '100',
    color: colors.color7,
  },
  link: {
    color: colors.color1,
    alignSelf: 'center',
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20,
    textTransform: 'uppercase',
    borderColor: 'rgb(0,0,0)',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 14,
  },
  lottieWrapper: {
    top: 50, // Adjust this value to position it correctly
    left: '50%',
    transform: [{ translateX: -150 }], // Centers the Lottie animation horizontally
  },
  lottie: {
    width: 300,
    height: 300,
    marginTop:-100,
    marginBottom:50,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  constraintText: {
    color: colors.color7,
    fontSize: 12,
    marginLeft: 20,
    marginTop: 5,
    opacity: 0.7,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.color1,
    marginLeft: 10,
  },
  modalBody: {
    marginBottom: 20,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalErrorText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  modalButton: {
    backgroundColor: colors.color1,
    borderRadius: 10,
    alignSelf: 'flex-end',
  }
});

export default Login;