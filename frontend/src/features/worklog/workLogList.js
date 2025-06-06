import { useGetAllWorkLogsQuery, makeWorkLogSelectors } from "./workLogApiSlice";
import WorkLog from './WorkLog';
import { useSelector } from "react-redux";

const WorkLogList = ({nameFilter = ''}) => {
    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllWorkLogsQuery(nameFilter);

    const { selectIds, selectById } = makeWorkLogSelectors(nameFilter);
    const ids = useSelector(selectIds);

    let content;

    if(isLoading) {
        content = <p>Loading...</p>
    }

    if(isError) {
        <p className="errmsg">
            {error?.data?.message || 'Error loading work‑logs.'}
        </p>
    }

    if(isSuccess) {
        const tableContents = ids?.length
        ? ids.map(id => (<WorkLog key={id} workLogId={id} selectById={selectById} />))
        : <tr><td colSpan={4}>No logs found.</td></tr>;

        content = (
        <table className="table table--worklogs">
            <thead className="table__thead">
                <tr>
                    <th scope="col" className="table__th worklog__name">Employee</th>
                    <th scope="col" className="table__th worklog__product">Product ID</th>
                    <th scope="col" className="table__th worklog__message">Message</th>
                    <th scope="col" className="table__th worklog__created">Created At</th>
                </tr>
            </thead>
            <tbody>{tableContents}</tbody>
      </table>
    );
    }
    return content;
}

export default WorkLogList;