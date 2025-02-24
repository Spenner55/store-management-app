import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import DashLayout from './components/DashLayout';
import EmployeesList from './features/employee/EmployeesList';
import Login from './features/auth/Login';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './features/auth/RequireAuth';
import Home from './features/auth/Home';
import { ROLES } from './config/roles';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />}/>

				<Route path='login' element={<Login/>}/>
                <Route path='unauthorized' element={<Unauthorized/>}/>

				<Route element={<RequireAuth allowedRoles={[ROLES.Employee, ROLES.Manager, ROLES.Admin]} />} >
					<Route path="dash" element={<DashLayout />} >

					<Route index element={<Home/>}/>

					<Route path='employees'>
						<Route index element={<EmployeesList />} />
					</Route>

					</Route>
				</Route>

				<Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />} >

				</Route>
				

			</Route>
		</Routes>
	);
}

export default App;