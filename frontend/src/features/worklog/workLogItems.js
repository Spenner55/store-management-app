const WorkLogItem = ({ item }) => {
  return (
    <tr className="worklog-items">
      <td className="items-table-product">{item.product_id}</td>
      <td className="items-table-quantity">{item.quantity}</td>
    </tr>
  );
};

export default WorkLogItem;