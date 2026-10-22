import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-slate-900 text-white p-4 flex items-center justify-between">
      <div className="text-lg font-semibold">Graph Studio</div>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/lab" className="hover:underline">
          Graph Lab
        </Link>
        <Link to="/theory" className="hover:underline">
          Theory
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
