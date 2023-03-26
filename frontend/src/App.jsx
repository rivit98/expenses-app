import { ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigation } from './components/nav/navigation';
import Home from './components/home/home';
import { withStore } from './context/store';
import { ExpensesAll } from './components/expensesAll/expensesAll';
import { isLoggedIn } from './context/userReducer';
import Login from './components/auth/login';
import { ExpensesMonthlySummary } from './components/expensesAll/expensesSummary';
import { Chart } from './components/chart/chart';

const guard = (logged, elem) => {
    return logged === true ? elem : <Navigate to="/login" />;
};

const App = () => {
    const logged = useSelector(isLoggedIn) || false;

    return (
        <Container mt={6} p={0} maxW="container.xl" centerContent>
            <Routes>
                <Route path="/" element={guard(logged, <Home />)} />
                <Route path="/login" element={<Login />} />
                <Route path="/all" element={guard(logged, <ExpensesAll />)} />
                <Route path="/summary" element={guard(logged, <ExpensesMonthlySummary />)} />
                <Route path="/chart" element={guard(logged, <Chart />)} />
            </Routes>
        </Container>
    );
};

const withComponent = (Wrapper, Wrapped) => (props) => {
    return (
        <Wrapper>
            <Wrapped {...props} />
        </Wrapper>
    );
};

const WrappedApp = [BrowserRouter, ChakraProvider, Navigation]
    .reverse()
    .reduce((acc, cur) => withComponent(cur, acc), App);

export default withStore(WrappedApp);
