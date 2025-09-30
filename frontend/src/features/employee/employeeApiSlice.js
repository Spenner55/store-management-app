import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from '../../app/api/apiSlice';

const employeesAdapter = createEntityAdapter({});

const inititalState = employeesAdapter.getInitialState();

export const employeesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEmployees: builder.query({
            query: () => '/employees',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const data = responseData?.data ?? responseData;
                const loadedEmployees = Array.isArray(data) ? data : [data];
                return employeesAdapter.setAll(inititalState, loadedEmployees);
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'Employee', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Employee', id}))
                    ]
                }
                else return [{type: 'Employee', id: 'LIST'}];
            },
            
        }),

        createNewEmployee: builder.mutation({
            query: initialEmployeeData => ({
                url: '/employees',
                method: 'POST',
                body: {
                    ...initialEmployeeData,
                }
            }),
            invalidatesTags: [
                {type: 'Employee', id: 'List'}
            ]
        }),

        updateEmployee: builder.mutation({
            query: initialEmployeeData => ({
                url: '/employees',
                method: 'PATCH',
                body: {
                    ...initialEmployeeData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Employee', id: arg.id}
            ]
        }),
        deleteEmployee: builder.mutation({
            query: ({id}) => ({
                url: '/employees',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Employee', id: arg.id}
            ]
        }),
    })
});

export const {
    useGetEmployeesQuery,
    useCreateNewEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeesApiSlice;

export const selectEmployeesResult = employeesApiSlice.endpoints.getEmployees.select();

const selectEmployeesData = createSelector(
    selectEmployeesResult,
    employeesResult => employeesResult.data
);

export const {
    selectAll: selectAllEmployees,
    selectById: selectEmployeesById,
    selectIds: selectEmployeeIds
} = employeesAdapter.getSelectors(state => selectEmployeesData(state) ?? inititalState);