import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  colors,
  defaultImg,
  defaultStyle,
  formHeading,
  inputOptions,
} from '../../styles/styles';
import { Avatar, Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message'; // Import Toast
import { MaterialIcons } from 'react-native-vector-icons';
import { setRegisteredUser } from './LoginScreen'; // Import function to set user data

const { width } = Dimensions.get('window');

const Signup = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPinCode] = useState('');
  
  // Error states for validation
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [cityError, setCityError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');

  // UI states
  const [showConstraints, setShowConstraints] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateName = (text) => {
    setName(text);
    if (!text) {
      setNameError('Name is required');
    } else if (text.length < 3) {
      setNameError('Name must be at least 3 characters');
    } else {
      setNameError('');
    }
  };

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
      
      // When password changes, check confirm password match
      if (confirmPassword && text !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else if (confirmPassword) {
        setConfirmPasswordError('');
      }
    }
  };
  
  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError('Please confirm your password');
    } else if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateAddress = (text) => {
    setAddress(text);
    if (!text) {
      setAddressError('Address is required');
    } else if (text.length < 5) {
      setAddressError('Address must be at least 5 characters long');
    } else {
      setAddressError('');
    }
  };

  const validateCity = (text) => {
    setCity(text);
    if (!text) {
      setCityError('City is required');
    } else if (text.length < 2) {
      setCityError('City name must be at least 2 characters');
    } else {
      setCityError('');
    }
  };

  const validateCountry = (text) => {
    setCountry(text);
    if (!text) {
      setCountryError('Country is required');
    } else if (text.length < 2) {
      setCountryError('Country name must be at least 2 characters');
    } else {
      setCountryError('');
    }
  };

  const submitHandler = () => {
    // Validate all fields before submission
    validateName(name);
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
    validateAddress(address);
    validateCity(city);
    validateCountry(country);
    
    // Collect all error messages
    const errors = [];
    if (nameError || !name) errors.push(nameError || 'Name is required');
    if (emailError || !email) errors.push(emailError || 'Email is required');
    if (passwordError || !password) errors.push(passwordError || 'Password is required');
    if (confirmPasswordError || !confirmPassword) errors.push(confirmPasswordError || 'Confirm password is required');
    if (addressError || !address) errors.push(addressError || 'Address is required');
    if (cityError || !city) errors.push(cityError || 'City is required');
    if (countryError || !country) errors.push(countryError || 'Country is required');
    
    // Check if there are any validation errors
    if (errors.length > 0) {
      setErrorMessages(errors);
      setShowErrorModal(true);
      return;
    }
    
    // If all validations pass
    setLoading(true);
    
    try {
      // Create user data object
      const userData = {
        name,
        email,
        password,
        address,
        city,
        country,
        avatar: avatar || defaultImg
      };
      
      // Store user data in the global variable through the exported function
      setRegisteredUser(userData);
      
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Account Created Successfully!',
        text2: 'You can now log in with your credentials.',
        visibilityTime: 3000,
      });

      navigation.navigate('LoginScreen');
    } catch (error) {
      console.log(error);
      setErrorMessages(['An error occurred while creating your account.']);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const disableBtn =
    !name || !email || !password || !address || !city || !country || !pinCode;

  useEffect(() => {
    if (route.params?.image) setAvatar(route.params?.image);
  }, [route.params]);
  
  return (
    <>
      <View style={{ ...defaultStyle, backgroundColor: colors.color2 }}>
        {/* Heading */}
        <View style={{ marginBottom: 20 }}>
          <Text style={formHeading}>Sign Up</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <View style={{ minHeight: 900 }}>
            <Avatar.Image
              style={{ alignSelf: 'center', backgroundColor: colors.color1 }}
              size={80}
              source={{ uri: avatar ? avatar : defaultImg }}
            />

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <TextInput
                {...inputOptions}
                placeholder='Name'
                value={name}
                onChangeText={validateName}
                onFocus={() => setShowConstraints(true)}
                error={Boolean(nameError)}
                style={[
                  inputOptions.style,
                  nameError ? styles.inputError : {}
                ]}
                theme={{ 
                  colors: { 
                    error: 'red',
                    primary: nameError ? 'red' : colors.color1,
                    background: nameError ? 'rgba(255, 0, 0, 0.05)' : 'white'
                  } 
                }}
                right={
                  <TextInput.Icon 
                    icon="information-outline" 
                    color={nameError ? 'red' : colors.color1}
                    onPress={() => {
                      Toast.show({
                        type: 'info',
                        text1: 'Name Requirements',
                        text2: 'Name must be at least 3 characters',
                        position: 'bottom',
                      });
                    }}
                  />
                }
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : 
                <Text style={styles.constraintText}>Minimum 3 characters</Text>
              }
            </View>
            
            {/* Email Input */}
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
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                {...inputOptions}
                placeholder='Password'
                value={password}
                onChangeText={validatePassword}
                secureTextEntry={true}
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
                <Text style={styles.constraintText}>
                  Minimum 6 characters, at least 1 uppercase letter and 1 number
                </Text>
              }
            </View>
            
            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                {...inputOptions}
                placeholder='Confirm Password'
                value={confirmPassword}
                onChangeText={validateConfirmPassword}
                secureTextEntry={true}
                onFocus={() => setShowConstraints(true)}
                error={Boolean(confirmPasswordError)}
                style={[
                  inputOptions.style,
                  confirmPasswordError ? styles.inputError : {}
                ]}
                theme={{ 
                  colors: { 
                    error: 'red',
                    primary: confirmPasswordError ? 'red' : colors.color1,
                    background: confirmPasswordError ? 'rgba(255, 0, 0, 0.05)' : 'white'
                  } 
                }}
                right={
                  <TextInput.Icon 
                    icon="information-outline" 
                    color={confirmPasswordError ? 'red' : colors.color1}
                    onPress={() => {
                      Toast.show({
                        type: 'info',
                        text1: 'Confirm Password',
                        text2: 'Must exactly match the password you entered above',
                        position: 'bottom',
                      });
                    }}
                  />
                }
              />
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : 
                <Text style={styles.constraintText}>Must match your password</Text>
              }
            </View>
            
            {/* Address Input */}
            <View style={styles.inputContainer}>
              <TextInput
                {...inputOptions}
                placeholder='Address'
                value={address}
                onChangeText={validateAddress}
                onFocus={() => setShowConstraints(true)}
                error={Boolean(addressError)}
                style={[
                  inputOptions.style,
                  addressError ? styles.inputError : {}
                ]}
                theme={{ 
                  colors: { 
                    error: 'red',
                    primary: addressError ? 'red' : colors.color1,
                    background: addressError ? 'rgba(255, 0, 0, 0.05)' : 'white'
                  } 
                }}
                right={
                  <TextInput.Icon 
                    icon="information-outline" 
                    color={addressError ? 'red' : colors.color1}
                    onPress={() => {
                      Toast.show({
                        type: 'info',
                        text1: 'Address Requirements',
                        text2: 'Address must be at least 5 characters',
                        position: 'bottom',
                      });
                    }}
                  />
                }
              />
              {addressError ? <Text style={styles.errorText}>{addressError}</Text> : 
                <Text style={styles.constraintText}>Minimum 5 characters</Text>
              }
            </View>
            
            {/* City Input */}
            <View style={styles.inputContainer}>
              <TextInput
                {...inputOptions}
                placeholder='City'
                value={city}
                onChangeText={validateCity}
                onFocus={() => setShowConstraints(true)}
                error={Boolean(cityError)}
                style={[
                  inputOptions.style,
                  cityError ? styles.inputError : {}
                ]}
                theme={{ 
                  colors: { 
                    error: 'red',
                    primary: cityError ? 'red' : colors.color1,
                    background: cityError ? 'rgba(255, 0, 0, 0.05)' : 'white'
                  } 
                }}
              />
              {cityError ? <Text style={styles.errorText}>{cityError}</Text> : 
                <Text style={styles.constraintText}>Required field</Text>
              }
            </View>
            
            {/* Country Input */}
            <View style={styles.inputContainer}>
              <TextInput
                {...inputOptions}
                placeholder='Country'
                value={country}
                onChangeText={validateCountry}
                onFocus={() => setShowConstraints(true)}
                error={Boolean(countryError)}
                style={[
                  inputOptions.style,
                  countryError ? styles.inputError : {}
                ]}
                theme={{ 
                  colors: { 
                    error: 'red',
                    primary: countryError ? 'red' : colors.color1,
                    background: countryError ? 'rgba(255, 0, 0, 0.05)' : 'white'
                  } 
                }}
              />
              {countryError ? <Text style={styles.errorText}>{countryError}</Text> : 
                <Text style={styles.constraintText}>Required field</Text>
              }
            </View>

            <Button
              style={styles.btn}
              textColor={colors.color2}
              onPress={submitHandler}
              loading={loading}
            >
              Sign Up
            </Button>

            <Text style={styles.or}>OR</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.link}>Log In</Text>
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
    marginBottom: 10,
  },
  btn: {
    backgroundColor: colors.color1,
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

export default Signup;
