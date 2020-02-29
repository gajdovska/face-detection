const environment = {};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    environment.apiURL = 'http://localhost:3000';
} else {
    // production code
    environment.apiURL = 'https://face-detection-apii.herokuapp.com';
}

export default environment;