import { createRoot } from 'react-dom/client';
import App from './App';
import { setupAxios } from './utils/axiosConfig';

setupAxios();
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
