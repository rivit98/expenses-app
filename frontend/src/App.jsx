import { ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/nav/navigation';
import Home from './components/home/home';
import { withStore } from './context/store';
import { ExpensesAll } from './components/expensesAll/expensesAll';

const App = () => {
    return (
        <Container mt={6} p={0} maxW="container.xl" centerContent>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/all" element={<ExpensesAll />} />
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
