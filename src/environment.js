const environment = {};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    environment.apiURL = 'https://face-detection-apii.herokuapp.com';
} else {
    // production code\
    environment.apiURL = 'http://localhost:3000';
}

export default environment;