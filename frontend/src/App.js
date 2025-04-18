import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import DashLayout from './components/DashLayout';
import EmployeesList from './features/employee/EmployeesList';
import WorkLogList from './features/worklog/workLogList';
import Login from './features/auth/Login';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './features/auth/RequireAuth';
import Home from './features/auth/Home';
import { ROLES } from './config/roles';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
//import useAutoLogin from './hooks/useAutoLogin';

function App() {
	//useAutoLogin();
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />}/>

				<Route path='login' element={<Login/>}/>
                <Route path='unauthorized' element={<Unauthorized/>}/>

				<Route element={<PersistLogin />} >
					<Route element={<Prefetch />} >
						<Route path="dash" element={<DashLayout />} >

							<Route index element={<Home/>}/>

							<Route path='employees'>
								<Route index element={<EmployeesList />} />
							</Route>

							<Route path='worklogs'>
			                    <Route index element={<WorkLogList />} />
			                </Route>

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