import { useGetAllItemsQuery } from "./inventoryApiSlice";
import Inventory from "./Inventory";

const InventoryList = () => {
    const {
        data: items,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllItemsQuery();

    let content;

    if (isLoading) {
        content = <p>Loading...</p>
    }

    if (isError) {
        content = <p className="errmsg">{error?.data?.message || "Error loading inventory."}</p>
    }

    if (isSuccess) {
        const {ids} = items;

        const tableContents = ids?.length ? ids.map(itemId => <Inventory key={itemId} itemId = {itemId}/>)
        : null

        content = (
            <table className="table table--employees">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th employee__first-name">Item Name</th>
                        <th scope="col" className="table__th employee__last-name">Current Stock</th>
                        <th scope="col" className="table__th employee__department">Price ($)</th>

                    </tr>
                </thead>
                <tbody>
                    {tableContents}
                </tbody>
            </table>
        )
    }

    return content;

}

export default InventoryList;