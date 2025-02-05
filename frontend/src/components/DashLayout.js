import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';
import styles from './DashLayout.module.css';

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className={styles.dashContainer}>
                <Outlet />
            </div>
            <DashFooter />
        </>
    );
}

export default DashLayout;
