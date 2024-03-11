import { ReactNode } from 'react';
import Layout from '../components/layout';
import Home from './home';



export default function Root(): ReactNode {
    return (
        <Layout>
            <Home />
        </Layout>
    )
}
