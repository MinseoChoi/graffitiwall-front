let sessionStorage = window.sessionStorage;

const setItem = ({ key, value }) => {
    sessionStorage.setItem(key, value);
};

const getItem = (key) => {
    return sessionStorage.getItem(key);
};

const removeItem = (key) => {
    sessionStorage.removeItem(key);
};