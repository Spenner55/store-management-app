import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import DashLayout from './components/DashLayout';
import EmployeesList from './features/employee/EmployeesList';
import Login from './features/auth/Login';
import Home from './features/auth/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />}/>

        <Route path='login' element={<Login/>}/>

        <Route path="dash" element={<DashLayout />} >

          <Route index element={<Home/>}/>

          <Route path='employees'>
            <Route index element={<EmployeesList />} />
          </Route>

        </Route>

      </Route>
    </Routes>
  );
}

export default App;