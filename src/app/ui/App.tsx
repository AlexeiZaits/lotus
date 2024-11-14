import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import './App.scss';

interface IAPP {
  children: ReactNode
}

const App = ({children}: IAPP) => {
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default App
