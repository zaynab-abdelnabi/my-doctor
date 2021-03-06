import React from 'react';
import * as Location from 'expo-location';
import { View, Text, KeyboardAvoidingView, CheckBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from './styles/authStyles';
import ScreenTitle from '../components/ScreenTitle';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import axios from '../config/axios';
import { SIGNUP_URL } from '../config/urls';

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            specialization: '',
            workingHours: '',
            address: '',
            phone: '',
            userType: false,
            location: null,
            isLoading: false,
            alert: {
                messages: null,
                type: '',
            }
        }
    }

    componentWillMount() {
        this._getLocation();
    }

    _getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        } else {
            let location = await Location.getCurrentPositionAsync({});
            console.log('location', location)
            this.setState({ location });
        }
    };

    componentDidMount() {
        const alert = this.props.navigation.getParam('alert');
        if (alert) {
            this.setState({ alert });
        }
    }
    componentDidUpdate() {
        if (this.state.alert.messages) {
            setTimeout(() => {
                this.setState({ alert: { messages: null } });
            }, 3000);
        }
    }
    componentWillUnmount() {
        clearTimeout();
    }



    changeNameHandler = value => {
        this.setState({ name: value });
    };
    changeEmailHandler = value => {
        this.setState({ email: value });
    };
    changePasswordHandler = value => {
        this.setState({ password: value });
    };
    changeUserTypeHandler = () => {
        this.setState({ userType: !this.state.userType })
    }
    changeSpeciatizationHandler = value => {
        this.setState({ specialization: value });
    };
    changeAddressHandler = value => {
        this.setState({ address: value });
    };
    changePhoneHandler = value => {
        this.setState({ phone: value });
    };
    changeWorkingHoursHandler = value => {
        this.setState({ workingHours: value });
    };

    validate() {
        const { name, email, password, specialization, address, workingHours, phone, userType } = this.state;
        let validationErrors = [];
        let passed = true;
        if (!name) {
            validationErrors.push("???????????? ?????????? ??????????");
            passed = false;
        }
        if (!email) {
            validationErrors.push("???????????? ?????????? ???????????? ????????????????????");
            passed = false;
        }
        if (!password) {
            validationErrors.push("???????????? ?????????? ???????? ????????????");
            passed = false;
        }
        if (userType) {
            if (!specialization) {
                validationErrors.push("???????????? ?????????? ????????????");
                passed = false;
            }
            if (!address) {
                validationErrors.push("???????????? ?????????? ??????????????");
                passed = false;
            }
            if (!phone) {
                validationErrors.push("???????????? ?????????? ?????? ????????????");
                passed = false;
            }
            if (!workingHours) {
                validationErrors.push("???????????? ?????????? ?????????? ??????????");
                passed = false;
            }
        }
        if (validationErrors.length > 0) {
            this.setState({ alert: { messages: validationErrors, type: "danger" } })
        }
        return passed;
    }

    _signUp = async () => {
        if (!this.validate()) return;
        this.setState({ isLoading: true });
        const { name, email, password, specialization, address, workingHours, phone, userType, location } = this.state;
        const body = {
            name,
            email,
            password,
            userType: userType ? "doctor" : "normal",
            specialization,
            address,
            workingHours,
            phone,
            location: {
                latitude: location ? location.coords.latitude : null,
                longitude: location ? location.coords.longitude : null
            }
        };
        try {
            const response = await axios.post(SIGNUP_URL, body);
            this.setState({
                name: '',
                email: '',
                password: '',
                specialization: '',
                workingHours: '',
                address: '',
                phone: '',
                userType: false,
                location: null,
                isLoading: false
            });
            this.props.navigation.navigate('SignIn', {
                alert: { messages: '???? ?????????? ?????????? ??????????', type: 'success' }
            });
        } catch (e) {
            this.setState({
                alert: { messages: e.response.data.message, type: "danger" },
            });
        }
    }


    render() {
        const { name, email, password, specialization, address, workingHours, phone, userType, isLoading, alert } = this.state;
        return (
            <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
                <Loader title="???????? ?????????? ???????? ????????" loading={isLoading} />
                <Alert messages={alert.messages} type={alert.type} />
                <View style={styles.container}>
                    <ScreenTitle title="?????????? ???????? ????????" icon="md-person-add" />
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <Input
                            placeholder="??????????"
                            onChangeText={this.changeNameHandler}
                            value={name}
                        />
                        <Input
                            placeholder="???????????? ????????????????????"
                            onChangeText={this.changeEmailHandler}
                            value={email}
                        />
                        <Input
                            placeholder="???????? ????????????"
                            secureTextEntry
                            onChangeText={this.changePasswordHandler}
                            value={password}
                        />
                        <View style={styles.checkboxContainer}>
                            <CheckBox
                                style={styles.checkbox}
                                value={userType}
                                onChange={this.changeUserTypeHandler}
                            />
                            <Text style={styles.checkboxLabel}>????????</Text>
                        </View>
                        {userType && (
                            <React.Fragment>
                                <Input
                                    placeholder="????????????"
                                    onChangeText={this.changeSpeciatizationHandler}
                                    value={specialization}
                                />
                                <Input
                                    placeholder="?????????? ??????????"
                                    onChangeText={this.changeWorkingHoursHandler}
                                    value={workingHours}
                                />
                                <Input
                                    placeholder="??????????????"
                                    onChangeText={this.changeAddressHandler}
                                    value={address}
                                />
                                <Input
                                    placeholder="?????? ????????????"
                                    onChangeText={this.changePhoneHandler}
                                    value={phone}
                                />
                            </React.Fragment>
                        )}

                        <Button text="??????????" onPress={this._signUp} />
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        );
    }
}

export default SignUpScreen;