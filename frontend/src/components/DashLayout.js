import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';
import styles from './DashLayout.module.css';

const DashLayout = () => {
    return (
        <div className={styles['dash-layout']}>
            <DashHeader />
            <div className={styles['dash-container']}>
                <Outlet />
            </div>
            <DashFooter />
        </div>
    );
}

export default DashLayout;
