import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation (replace with actual auth logic)
    if (email && password) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-primary text-white flex flex-col justify-center items-center p-12">
        <div className="text-5xl font-bold mb-6">ORINEX</div>
        <p className="text-center max-w-md">
          AI-Powered Order Processing Automation for Manufacturing Businesses in Nagpur
        </p>
      </div>
      
      <div className="w-1/2 flex justify-center items-center p-12">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <h2 className="text-3xl mb-8 text-center">Login to Your Account</h2>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email or Mobile</label>
            <input 
              type="text" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email or mobile number"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
          >
            Login
          </button>
          
          <div className="text-center mt-6">
            <a href="#" className="text-primary hover:underline mr-4">Forgot Password?</a>
            <a href="#" className="text-primary hover:underline">Request a Demo</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
