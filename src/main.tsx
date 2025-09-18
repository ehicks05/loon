import { BrowserRouter } from 'react-router-dom';
import App from './App';

export const AppWrap = () => {
	return (
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
};
