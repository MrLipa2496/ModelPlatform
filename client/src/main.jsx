import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import './reset.css';
import store from './store';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
