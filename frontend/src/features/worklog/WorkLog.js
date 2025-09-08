import { useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import WorkLogItem from './workLogItems';

const WorkLog = ({workLogId, selectById}) => {
    const workLog = useSelector(state => selectById(state, workLogId));
    const [open, setOpen] = useState(false);

    const items = useMemo(
        () => (Array.isArray(workLog?.items) ? workLog.items : []),
        [workLog?.items]
    );
    const totalQty = useMemo(
        () => items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
        [items]
    );

    if (!workLog) return null;

    const cellStatus = workLog.active ? '' : '-inactive';

    const tableContents = items?.length ? items.map((it) => (
      <WorkLogItem
        key={`${workLog.worklog_id}-${it.product_id}`} item={it}/>))
        : <tr><td colSpan={4}>No Products Recorded.</td></tr>;

    return (
        <>
        <tr className="worklog">
            <td className={`worklog-row${cellStatus}`}>
            {workLog.first_name} {workLog.last_name}
            </td>
            <td className={`worklog-row${cellStatus}`}>{workLog.message || ''}</td>
            <td>
                <button
                    type="button"
                    className="expand-btn"
                    aria-expanded={open}
                    aria-controls={`items-${workLog.worklog_id}`}
                    onClick={() => setOpen(o => !o)}
                >
                    {open ? '▾ Hide' : '▸ Show'} {items.length} item{items.length !== 1 ? 's' : ''} (total {totalQty})
                </button>
                {open ? 
                    <table className='items-table'>
                        <thead>
                            <tr>
                                <th scope="col" className="items-table-product">Product ID</th>
                                <th scope="col" className="items-table-quantity">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>{tableContents}</tbody>
                    </table> 
                    : ''
                }
            </td>
            <td>{new Date(workLog.created_at).toLocaleString()}</td>
        </tr>
        </>
    );
}

export default WorkLog;