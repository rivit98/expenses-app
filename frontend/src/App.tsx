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
import Meters from './components/meters/meters';
import { ReactElement } from 'react';

const guard = (logged: boolean, elem: ReactElement): ReactElement => {
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
                <Route path="/meters" element={guard(logged, <Meters />)} />
            </Routes>
        </Container>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withComponent = (Wrapper: React.ComponentType<any>, Wrapped: React.ComponentType<any>) => {
    const Combined = (props: Record<string, never>) => {
        return (
            <Wrapper>
                <Wrapped {...props} />
            </Wrapper>
        );
    };
    return Combined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WrappedApp = ([BrowserRouter, ChakraProvider, Navigation] as React.ComponentType<any>[])
    .reverse()
    .reduce((acc, cur) => withComponent(cur, acc), App as React.ComponentType<any>);

export default withStore(WrappedApp);
