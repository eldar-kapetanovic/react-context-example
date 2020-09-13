# reat-context-example

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Run project

### `npm start`

To run the project locally, navigate to the project folder and execute `npm start` command.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## About project

`Google Firebase` database is used as a backend for this small showcase app. 

Read access is granted for all, so anyone can read posts and comments. Only authenticated users can edit data. For login application uses 
"Email and password-based authentication" from Firebase SDK. 

The test account for this application is:
username: `test@test.com`
password: `Test1234`

The intention of this application is to show how the React context can be used to propagate the state through the whole application. REST API calls are also done by calling functions from the global application state. REST API calls are defined in the `apiCalls.js` class. Convention to prefix functions from `apiCalls.js` class with `call` word is used to better distinguish functions in the application context. All results of the execution of function prefixed with "call" word will be stored in an appropriate context variable named the same as a function from the `apiCalls.js` file. For example `updatePosts` function from `apiCalls.js` file could be executed by executing `callUpdatePosts` function from react context. The results of this execution will be stored in context variable named `updatePosts`.

The application context is combined from functions from `apiCalls.js` and variables from the `initialState.js` file. The initial value of variables stored in the application context will be the same as defined in the `initialState.js` file. For every property of the "initialState" object from the `initialState.js` file, an appropriate function prefixed with "set" word will be created as part of the application context. For example `authenticated` "initialState" object property will have `setAuthenticated` method to change the value of the "authenticated" variable in the application context.