import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ConnectionProvider } from './providers/connection_provider';
import { GenerateProvider } from './providers/generate_provider';

// Wrapped in ConnectionProvider to get a global state using context API
ReactDOM.render(
    <GenerateProvider>
        <ConnectionProvider>
            <App />
        </ConnectionProvider>
    </GenerateProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
