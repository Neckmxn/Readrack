import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, Lock, Phone } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle, loginWithFacebook, loginWithPhone, setupRecaptcha } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to log in with Google: ' + error.message);
    }
    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithFacebook();
      navigate('/');
    } catch (error) {
      setError('Failed to log in with Facebook: ' + error.message);
    }
    setLoading(false);
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      const confirmationResult = await loginWithPhone(phoneNumber, recaptchaVerifier);
      const verificationCode = prompt('Enter the verification code sent to your phone:');
      if (verificationCode) {
        await confirmationResult.confirm(verificationCode);
        navigate('/');
      }
    } catch (error) {
      setError('Failed to log in with phone: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <BookOpen className="mx-auto h-16 w-16 text-blue-300" />
            <h2 className="mt-4 text-3xl font-bold text-white">Welcome to Readrack</h2>
            <p className="mt-2 text-blue-200">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-500 text-white p-3 rounded-md text-sm">{error}</div>
          )}

          <div className="mb-6 flex space-x-2">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                loginMethod === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-700 text-blue-200'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-md transition ${
                loginMethod === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-700 text-blue-200'
              }`}
            >
              Phone
            </button>
          </div>

          {loginMethod === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-blue-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-blue-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-blue-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div id="recaptcha-container"></div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary disabled:opacity-50"
              >
                {loading ? 'Sending code...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-blue-800 text-blue-300">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="py-2 px-4 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition font-medium disabled:opacity-50"
              >
                Google
              </button>
              <button
                onClick={handleFacebookLogin}
                disabled={loading}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-blue-200 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-300 hover:text-blue-100 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;