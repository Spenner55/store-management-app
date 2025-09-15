import { selectAllItems, useGetAllItemsQuery } from "./inventoryApiSlice";
import Inventory from "./Inventory";
import { useState, useMemo } from 'react';
import { useSelector } from "react-redux";

const InventoryList = () => {
    const {
        data: items,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllItemsQuery();

    const [query, setQuery] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    const allItems = useSelector(selectAllItems);

    const filteredIds = useMemo(() => {
        if(!items?.ids?.length) return [];

        const q = query.trim().toLowerCase();

        return allItems.filter((it) => {
            if (!it) return false;
            const nameMatch = q === "" || (it.item_name ?? "").toLowerCase().includes(q);
            const stockMatch = !inStockOnly || Number(it.current_stock) > 0;
            return nameMatch && stockMatch;
        }).map((it) => it.id);
    }, [items?.ids, allItems, query, inStockOnly]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>
    }

    if (isError) {
        content = <p className="errmsg">{error?.data?.message || "Error loading inventory."}</p>
    }

    if (isSuccess) {
        const tableContents = filteredIds?.length ? filteredIds.map(itemId => <Inventory key={itemId} itemId = {itemId}/>)
        : null

        content = (
            <>
                <div>
                    <input
                        type="text"
                        placeholder="search inventory"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In stock only
                </label>
                <table className="inventory-table">
                    <thead className="table__thead">
                        <tr>
                            <th scope="col" className="table__th employee__first-name">Item Name</th>
                            <th scope="col" className="table__th employee__last-name">Current Stock</th>
                            <th scope="col" className="table__th employee__department">Price ($)</th>

                        </tr>
                    </thead>
                    <tbody>
                        {tableContents || (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                                    No items match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>
        )
    }

    return content;

}

export default InventoryList;