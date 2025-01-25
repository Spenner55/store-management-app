import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeesById } from './employeeApiSlice';

const Employee = ({employeeId}) => {
    const employee = useSelector(state => selectEmployeesById(state, employeeId));

    const navigate = useNavigate();

    if(employee) {
        const handleEdit = () => navigate(`/dash/employees/${employeeId}`);

        const cellStatus = employee.active ? '' : 'table__cell--inactive';

        return (
            <tr className='table__row employee'>
                <td className={`table__cell ${cellStatus}`}>
                    {employee.first_name}
                </td>
                <td className={`table__cell ${cellStatus}`}>
                    {employee.last_name}
                </td>
                <td className={`table__cell ${cellStatus}`}>
                    {employee.department}
                </td>
                <td className={`table__cell ${cellStatus}`}>
                    {employee.role}
                </td>
                <td className={`table__cell ${cellStatus}`}>
                    {employee.wage}
                </td>
                <td className={`table__cell ${cellStatus}`}>
                    {employee.email}
                </td>
                <td className='table__button' onClick={handleEdit}>
                    Edit
                </td>
            </tr>
        )
    }
    else return null;
}

export default Employee;