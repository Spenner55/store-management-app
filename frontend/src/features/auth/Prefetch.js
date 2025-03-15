import { store } from '../../app/store';
import { employeesApiSlice } from '../employee/employeeApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('Subscribing');
        const employees = store.dispatch(employeesApiSlice.endpoints.getEmployees.initiate());

        return () => {
            console.log('Unsubscribing');
            employees.unsubscribe();
        }
    }, [])

    return <Outlet />
}

export default Prefetch;
