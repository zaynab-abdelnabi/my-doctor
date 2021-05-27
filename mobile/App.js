import React from 'react';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import AppNavigation from './config/routes';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    }
  }
  async componentWillMount() {
    await Permissions.askAsync(Permissions.LOCATION);
  }

  async _getFonts() {
    await Font.loadAsync({
      'noto-font': require('./assets/fonts/NotoKufiArabic-Regular.ttf')
    });
  }
  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._getFonts}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }
    return (
      <AppNavigation />
    )
  }
}

