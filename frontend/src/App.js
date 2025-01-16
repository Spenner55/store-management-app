import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import DashLayout from './components/DashLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />}/>
        <Route path="dash" element={<DashLayout />}/>
      </Route>
    </Routes>
  );
}

export default App;