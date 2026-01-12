import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <Bike className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight">RideWise</span>
          </Link>

          {/* Links */}
          <div className="flex space-x-8 text-sm font-medium">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link to="/predict" className="hover:text-blue-200 transition">Predict</Link>
            <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
