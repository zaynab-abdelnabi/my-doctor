import React from 'react';
import { KeyboardAvoidingView, AsyncStorage } from 'react-native';
import axios from '../config/axios';
import { SIGNIN_URL } from '../config/urls';
import { ScrollView } from 'react-native-gesture-handler';
import ScreenTitle from '../components/ScreenTitle';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Alert from '../components/Alert';


class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading: false,
            alert: {
                messages: null,
                type: '',
            }
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
    changeEmailHandler = value => {
        this.setState({ email: value });
    };
    changePasswordHandler = value => {
        this.setState({ password: value });
    };

    validate() {
        const { email, password } = this.state;
        let validationErrors = [];
        let passed = true;
        if (!email) {
            validationErrors.push("الرجاء إدخال البريد الألكتروني");
            passed = false;
        }
        if (!password) {
            validationErrors.push("الرجاء إدخال كلمة المرور");
            passed = false;
        }
        if (validationErrors.length > 0) {
            this.setState({ alert: { messages: validationErrors, type: "danger" } })
        }
        return passed;
    }

    _signIn = async () => {
        if (!this.validate()) return;

        this.setState({ isLoading: true });
        const { email, password } = this.state;
        const body = {
            email,
            password
        };
        try {
            const response = await axios.post(SIGNIN_URL, body);
            this.setState({
                email: '',
                password: '',
                isLoading: false
            });
            AsyncStorage.setItem("accessToken", response.data.accessToken);
            this.props.navigation.navigate('Doctors');
        } catch (e) {
            this.setState({
                alert: { messages: e.response.data.message, type: "danger" },
            });
        }
    };


    render() {
        const { email, password, isLoading, alert } = this.state;
        return (
            <Container>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingVertical: 40 }}
                >
                    <Alert messages={alert.messages} type={alert.type} />
                    <Loader title="جاري تسجيل الدخول" loading={isLoading} />
                    <ScreenTitle title="تسجيل الدخول" icon="md-log-in" />
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <Input
                            placeholder="البريد الألكتروني"
                            onChangeText={this.changeEmailHandler}
                            value={email}
                        />
                        <Input
                            placeholder="كلمة المرور"
                            secureTextEntry
                            onChangeText={this.changePasswordHandler}
                            value={password}
                        />
                    </KeyboardAvoidingView>
                    <Button text="تسجيل دخول" onPress={this._signIn} />
                </ScrollView>
            </Container>
        );
    }
}

export default SignInScreen;