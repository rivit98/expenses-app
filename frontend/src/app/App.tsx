import { ReactElement, ReactNode } from 'react';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { Navigation } from './components/nav/navigation';
import Home from './components/home/home';
import { withStore } from './context/store';
import { ExpensesAll } from './components/expensesAll/expensesAll';
import { isLoggedIn } from './context/userReducer';
import Login from './components/auth/login';
import { ExpensesMonthlySummary } from './components/expensesAll/expensesSummary';
import Meters from './components/meters/meters';

type WrapperComponent = React.ComponentType<{ children?: ReactNode }>;

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

const withComponent = (Wrapper: WrapperComponent, Wrapped: WrapperComponent): WrapperComponent => {
    const Combined = (props: { children?: ReactNode }) => {
        return (
            <Wrapper>
                <Wrapped {...props} />
            </Wrapper>
        );
    };
    return Combined;
};

const withQueryClient = (Wrapped: WrapperComponent) => {
    const QueryWrapper = (props: { children?: ReactNode }) => {
        return (
            <QueryClientProvider client={queryClient}>
                <Wrapped {...props} />
            </QueryClientProvider>
        );
    };
    return QueryWrapper;
};

const WrappedApp = ([BrowserRouter, ChakraProvider, Navigation] as WrapperComponent[])
    .reverse()
    .reduce((acc, cur) => withComponent(cur, acc), App as WrapperComponent);

export default withStore(withQueryClient(WrappedApp));
