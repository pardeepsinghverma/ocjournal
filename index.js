/**
 * @format
 */

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import {AppRegistry} from 'react-native';

// react-native-reanimated-carousel reads shared values during its internal
// render cycle, which triggers Reanimated v3.16+ strict-mode warnings.
// Our own components use useAnimatedStyle correctly — disable strict mode
// to silence the false-positive from the library.
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
