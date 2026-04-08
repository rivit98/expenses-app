import { ReactElement, ReactNode } from 'react';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { Navigation } from '../features/nav/Navigation';
import Home from '../features/home/Home';
import { withStore } from '../store/store';
import { ExpensesAll } from '../features/expenses/ExpensesAll';
import { isLoggedIn } from '../store/userReducer';
import Login from '../features/auth/Login';
import { ExpensesMonthlySummary } from '../features/expenses/ExpensesSummary';
import Meters from '../features/meters/Meters';

type WrapperComponent = React.ComponentType<{ children?: ReactNode }>;

const Guard = ({ logged, children }: { logged: boolean; children: ReactElement }) => {
    const location = useLocation();
    return logged ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

const App = () => {
    const logged = useSelector(isLoggedIn) || false;

    return (
        <Container mt={6} p={0} maxW="container.xl" centerContent>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Guard logged={logged}>
                            <Home />
                        </Guard>
                    }
                />
                <Route path="/login" element={logged ? <Navigate to="/" replace /> : <Login />} />
                <Route
                    path="/all"
                    element={
                        <Guard logged={logged}>
                            <ExpensesAll />
                        </Guard>
                    }
                />
                <Route
                    path="/summary"
                    element={
                        <Guard logged={logged}>
                            <ExpensesMonthlySummary />
                        </Guard>
                    }
                />
                <Route
                    path="/meters"
                    element={
                        <Guard logged={logged}>
                            <Meters />
                        </Guard>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
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
