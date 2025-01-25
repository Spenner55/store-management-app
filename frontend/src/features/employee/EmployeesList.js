import { useGetEmployeesQuery } from "./employeeApiSlice";
import Employee from "./Employee";

const EmployeesList = () => {
    
    const {
        data: employees,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetEmployeesQuery();

    let content;

    if (isLoading) {
        content = <p>Loading...</p>
    }

    if (isError) {
        content = <p className="errmsg">{error?.data?.message || "Error loading employees."}</p>;
    }

    if(isSuccess) {
        const {ids} = employees;

        const tableContents = ids?.length
            ? ids.map(employeeId => <Employee key={employeeId} employeeId={employeeId}/>)
            : null

        content = (
            <table className="table table--employees">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th employee__first-name">First Name</th>
                        <th scope="col" className="table__th employee__last-name">Last Name</th>
                        <th scope="col" className="table__th employee__department">Department</th>
                        <th scope="col" className="table__th employee__role">Role</th>
                        <th scope="col" className="table__th employee__wage">Wage</th>
                        <th scope="col" className="table__th employee__email">Email</th>
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

export default EmployeesList;