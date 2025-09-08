import { store } from '../../app/store';
import { employeesApiSlice } from '../employee/employeeApiSlice';
import { workLogsApiSlice } from '../worklog/workLogApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('Subscribing');
        const employees = store.dispatch(employeesApiSlice.endpoints.getEmployees.initiate());
        const worklogs = store.dispatch(workLogsApiSlice.endpoints.getAllWorkLogs.initiate());

        return () => {
            console.log('Unsubscribing');
            employees.unsubscribe();
            worklogs.unsubscribe();
        }
    }, [])

    return <Outlet />
}

export default Prefetch;
