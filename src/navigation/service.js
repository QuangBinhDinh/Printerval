import { createNavigationContainerRef } from '@react-navigation/native';
import { StackActions, CommonActions } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

const navigate = (name, params, key) => {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.navigate({ name, params, ...(!!key && { key: `${name} ${key}` }) }));
    }
};

const replace = (name, params) => {
    if (navigationRef.isReady) {
        navigationRef.dispatch(StackActions.replace(name, params));
    }
};

const pushNavigate = (name, params, key) => {
    if (navigationRef.isReady) {
        navigationRef.dispatch(StackActions.push(name, params));
    }
};

const pop = (numberPop = 1) => {
    if (navigationRef.isReady) {
        navigationRef.dispatch(StackActions.pop(numberPop));
    }
};

const goBack = () => {
    if (navigationRef.isReady()) {
        navigationRef.goBack();
    }
};

export { navigationRef, navigate, goBack, replace, pushNavigate, pop };
