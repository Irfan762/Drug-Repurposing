import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen text-white pl-72 transition-all duration-300 font-sans">
            <Sidebar />
            <main className="p-10 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
