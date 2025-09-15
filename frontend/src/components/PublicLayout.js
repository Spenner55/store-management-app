import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import styles from './PublicLayout.module.css';

const PublicLayout = () => {
    return (
        <div className={styles['public-layout']}>
            <PublicHeader />
            <div className={styles['public-layout-container']}>
                <Outlet />
            </div>
        </div>
    )
}

export default PublicLayout;