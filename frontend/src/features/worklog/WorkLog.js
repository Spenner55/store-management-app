import { useSelector } from 'react-redux';

const WorkLog = ({workLogId, selectById}) => {
    const workLog = useSelector(state => selectById(state, workLogId));

    if(workLog) {

        const cellStatus = workLog.active ? '' : '-inactive';

        return (
            <tr className='worklog'>
                <td className={`worklog-row${cellStatus}`}>
                    {workLog.first_name} {workLog.last_name}
                </td>
                <td className={`worklog-row${cellStatus}`}>
                    {Array.isArray(workLog.message) ? workLog.message.join(', ') : workLog.message}
                </td>
                <td>
                    {Array.isArray(workLog.product_id) ? workLog.product_id.join(', ') : workLog.product_id}
                </td>
                <td>
                    {new Date(workLog.created_at).toLocaleString()}
                </td>
            </tr>
        )
    }
}

export default WorkLog;