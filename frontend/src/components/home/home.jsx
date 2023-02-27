import { useSelector } from 'react-redux';
import { isLoggedIn } from '../../context/userReducer';
import Login from '../auth/login';

const Home = () => {
    const logged = useSelector(isLoggedIn) || false;

    if (!logged) {
        return <Login />;
    }

    return <>homepage</>;
};

export default Home;
