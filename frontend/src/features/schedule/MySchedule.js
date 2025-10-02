import EmployeeSchedule from "./Schedule";
import useAuth from "../../hooks/useAuth";

const MySchedule = () => {
    const { id } = useAuth();
    return <EmployeeSchedule employeeId={id}/>;
}

export default MySchedule;