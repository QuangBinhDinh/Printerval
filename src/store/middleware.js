export const logger = store => next => action => {
    let result = next(action);
    if (
        !action.type.includes('api') &&
        !action.type.includes('domainApi') &&
        !action.type.includes('globalApi') &&
        !action.type.includes('persist')
    ) {
        console.group(action.type);
        console.info('dispatching', action);
        console.log('next state', store.getState());
        console.groupEnd();
    }
    return result;
};
