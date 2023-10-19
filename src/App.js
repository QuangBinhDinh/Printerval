import React from 'react';
import { LogBox } from 'react-native';
import Router from './navigation';
import { Provider } from 'react-redux';
import Store from '@store/store';
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
    return (
        <Provider store={Store}>
            <Router></Router>
        </Provider>
    );
};

export default App;
