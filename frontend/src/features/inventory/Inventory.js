import { useSelector } from "react-redux";
import { selectItemById } from "./inventoryApiSlice";

const Inventory = ({itemId}) => {
    const item = useSelector(state => selectItemById(state, itemId));

    if(item) {
        return (   
            <tr className="item">
                <td className="item-row">
                    {item.item_name}
                </td>
                <td className="item-row">
                    {item.current_stock}
                </td>
                <td className="item-row">
                    {item.price}
                </td>
            </tr>
        )
    }
    else return null;
}

export default Inventory;