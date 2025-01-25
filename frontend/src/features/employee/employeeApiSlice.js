import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from '../../app/api/apiSlice';

const employeesAdapter = createEntityAdapter({});

const inititalState = employeesAdapter.getInitialState();

export const employeesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEmployees: builder.query({
            query: () => '/employees',
            validateStatus: (reponse, result) => {
                return reponse.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedEmployees = responseData.map(employee => {
                    employee.id = employee._id;
                    return employee;
                });
                return employeesAdapter.setAll(inititalState, loadedEmployees);
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'Employee', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Employee', id}))
                    ]
                }
                else return [{type: 'User', id: 'LIST'}];
            }
        })
    })
})

export const {
    useGetEmployeesQuery,
} = employeesApiSlice;

export const selectEmployeesResult = employeesApiSlice.endpoints.getEmployees.select();

const selectEmployeesData = createSelector(
    selectEmployeesResult,
    employeesResult => employeesResult.data
);

export const {
    selectAll: selectAllEmployees,
    selectById: selectEmployeesById,
    selectIds: selectUserIds
} = employeesAdapter.getSelectors(state => selectEmployeesData(state) ?? inititalState);