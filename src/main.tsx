import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { store, persistor } from './framework/redux/store.ts';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// React.StrictMode 在dev环境下会导致页面组件挂载2次
ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
    ,
//    </React.StrictMode>
);
