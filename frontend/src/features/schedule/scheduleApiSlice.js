import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const scheduleAdapter = createEntityAdapter({
    selectId: (shift) => shift.id
});

const initialState = scheduleAdapter.getInitialState();

export const scheduleApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMyShifts: builder.query({
            query: ({ employeeId, from, to }) => ({
                url: `/schedule/${employeeId}`,
                params: { from, to },
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            keepUnusedDataFor: 300,
            transformResponse: responseData => {
                const data = responseData.data ?? responseData;
                const loadedShifts = Array.isArray(data) ? data : [data];
                return scheduleAdapter.setAll(initialState, loadedShifts);
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'Shift', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Shift', id}))
                    ];
                }
                else return [{type: 'Shift', id: 'LIST'}];
            }
        }),
        getAllShifts: builder.query({
            query: ({ from, to }) => ({
                url: '/schedule',
                params: { from, to},
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const data = responseData.data ?? responseData;
                const loadedShifts = Array.isArray(data) ? data : [data];
                return scheduleAdapter.setAll(initialState, loadedShifts);
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'Shift', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Shift', id}))
                    ];
                }
                else return [{type: 'Shift', id: 'LIST'}];
            }
        }),
        createNewShift: builder.mutation({
            query: (body) => ({
                url: '/schedule',
                method: 'POST',
                body,
            }),
            invalidatesTags: [
                {type: 'Shift', id: 'LIST'}
            ]
        }),
        updateShift: builder.mutation({
            query: (body) => ({
                url: `/schedule/${body.id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Shift', id: arg.id},
                {type: 'Shift', id: 'LIST'}
            ]
        }),
        deleteShift: builder.mutation({
            query: ({id}) => ({
                url: `/schedule/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Shift', id: arg.id},
                {type: 'Shift', id: 'LIST'}
            ]
        }),
    })
});

export const {
    useGetMyShiftsQuery,
    useGetAllShiftsQuery,
    useCreateNewShiftMutation,
    useUpdateShiftMutation,
    useDeleteShiftMutation,
} = scheduleApiSlice;

//All employee selectors
export const selectScheduleResult = (args) => 
    scheduleApiSlice.endpoints.getAllShifts.select(args);

const selectScheduleData = (args) => 
    createSelector(selectScheduleResult(args), (res) => res?.data);

export const makeAllShiftsSelectors = (args) => 
    scheduleAdapter.getSelectors((state) => selectScheduleData(args)(state) ?? initialState);

//Individual employee selectors
export const selectMyScheduleResult = (args) =>
    scheduleApiSlice.endpoints.getMyShifts.select(args);

const selectMyScheduleData = (args) =>
    createSelector(selectMyScheduleResult(args), (res) => res?.data);

export const makeMyScheduleSelectors = (args) =>
    scheduleAdapter.getSelectors((state) => selectMyScheduleData(args)(state) ?? initialState);