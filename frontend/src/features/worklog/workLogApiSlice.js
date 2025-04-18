import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from '../../app/api/apiSlice';

const workLogsAdapter = createEntityAdapter({
    selectId: (worklog) => worklog.worklog_id
});

const initialState = workLogsAdapter.getInitialState();

export const workLogsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllWorkLogs: builder.query({
            query: (name = '') => 
                name ? `/worklogs?name=${encodeURIComponent(name)}` : '/worklogs',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                console.log("API Response:", responseData);
                const data = responseData?.data ?? responseData;
                const normalized = Array.isArray(data) ? data : [data];
                const loadedWorkLogs = normalized.map(wl => {
                    wl.id = wl.worklog_id;
                    return wl;
                });
                console.log("Loaded WorkLogs:", loadedWorkLogs);
                return workLogsAdapter.setAll(initialState, loadedWorkLogs);
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'WorkLog', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'WorkLog', id}))
                    ];
                }
                else return [{type: 'WorkLog', id: 'LIST'}];
            }
        }),
        getEmployeeWorkLogs: builder.query({
            query: (employee) => `/worklogs/${employee}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                console.log("API Response:", responseData);
                const data = responseData?.data ?? responseData;
                const normalized = Array.isArray(data) ? data : [data];
                const loadedWorkLogs = normalized.map(wl => {
                    wl.id = wl.workLog_id;
                    return wl;
                });
                console.log("Loaded WorkLogs:", loadedWorkLogs);
                return workLogsAdapter.setAll(initialState, loadedWorkLogs);
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'WorkLog', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'WorkLog', id}))
                    ];
                }
                else return [{type: 'WorkLog', id: 'LIST'}];
            }
        }),
        createNewWorkLog: builder.mutation({
            query: initialWorkLogData => ({
                url: '/worklogs',
                method: 'POST',
                body: {
                    ...initialWorkLogData,
                }
            }),
            invalidatesTags: [
                {type: 'WorkLog', id: 'LIST'}
            ]
        }),
    })
});

export const {
    useGetAllWorkLogsQuery,
    useGetEmployeeWorkLogsQuery,
    useCreateNewWorkLogMutation,
} = workLogsApiSlice;

export const makeWorkLogSelectors = (arg = '') => {

    const selectWorkLogsResult = workLogsApiSlice.endpoints.getAllWorkLogs.select(arg);
  
    const selectWorkLogsData = createSelector(
      selectWorkLogsResult,
      result => result?.data ?? initialState
    );

    return workLogsAdapter.getSelectors(selectWorkLogsData);
  };