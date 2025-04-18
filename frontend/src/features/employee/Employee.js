import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeesById } from './employeeApiSlice';

const Employee = ({employeeId}) => {
    const employee = useSelector(state => selectEmployeesById(state, employeeId));

    const navigate = useNavigate();

    if(employee) {
        const handleEdit = () => navigate(`/dash/employees/${employeeId}`);

        const cellStatus = employee.active ? '' : '-inactive';

        return (
            <tr className='employee'>
                <td className={`employee-row ${cellStatus}`}>
                    {employee.first_name}
                </td>
                <td className={`employee-row ${cellStatus}`}>
                    {employee.last_name}
                </td>
                <td className={`employee-row ${cellStatus}`}>
                    {employee.department}
                </td>
                <td className={`employee-row ${cellStatus}`}>
                    {employee.role}
                </td>
                <td className={`employee-row ${cellStatus}`}>
                    {employee.wage}
                </td>
                <td className={`employee-row ${cellStatus}`}>
                    {employee.email}
                </td>
                <td className='employee-edit' onClick={handleEdit}>
                    Edit
                </td>
            </tr>
        )
    }
    else return null;
}

export default Employee;