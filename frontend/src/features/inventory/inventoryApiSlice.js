import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const inventoryAdapter = createEntityAdapter({});

const inititalState = inventoryAdapter.getInitialState();

export const inventoryApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllItems: builder.query({
            query: () => '/inventory',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            keepUnusedDataFor: 300,
            transformResponse: responseData => {
                const data = responseData?.data ?? responseData;
                const loadedItems = Array.isArray(data) ? data : [data];
                return inventoryAdapter.setAll(inititalState, loadedItems);
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'Item', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'Item', id}))
                    ]
                }
                else return [{type: 'Item', id: 'LIST'}];
            }
        }),
        createNewItem: builder.mutation({
            query: initialItemData => ({
                url: '/inventory',
                method: 'POST',
                body: {
                    ...initialItemData,
                }
            }),
            invalidatesTags: [
                {type: 'Item', id: 'LIST'}
            ]
        }),
        updateItem: builder.mutation({
            query: initialItemData => ({
                url: '/inventorys',
                method: 'PATCH',
                body: {
                    ...initialItemData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Item', id: arg.id}
            ]
        }),
        deleteItem: builder.mutation({
            query: ({id}) => ({
                url: '/inventorys',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Item', id: arg.id}
            ]
        }),
    })
})

export const {
    useGetAllItemsQuery,
    useCreateNewItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = inventoryApiSlice;

export const selectInventoryResult = inventoryApiSlice.endpoints.getAllItems.select();

const selectInventoryData = createSelector(
    selectInventoryResult,
    inventoryResult => inventoryResult.data
)

export const {
    selectAll: selectAllItems,
    selectById: selectItemById,
    selectIds: selectItemIds
} = inventoryAdapter.getSelectors(state => selectInventoryData(state) ?? inititalState);