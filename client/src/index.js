import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ConnectionProvider } from './providers/connection_provider';
import { ConfigProvider } from './providers/config_provider';

// Wrapped in ConnectionProvider to get a global state using context API
ReactDOM.render(
    <ConfigProvider>
        <ConnectionProvider>
            <App />
        </ConnectionProvider>
    </ConfigProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
