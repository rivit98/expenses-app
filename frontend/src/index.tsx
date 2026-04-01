import { createRoot } from 'react-dom/client';
import App from './app/App';
import { setupAxios } from './utils/axiosConfig';
import './index.css';

setupAxios();
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
