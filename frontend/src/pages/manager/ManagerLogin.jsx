import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerAPI } from '../../services/managerAPI';
import { Lock, AlertCircle, Loader } from 'lucide-react';

const ManagerLogin = () => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus on first input on load
    inputRefs.current[0]?.focus();

    // Check if already logged in
    const token = localStorage.getItem('managerToken');
    if (token) {
      navigate('/manager/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Move to next input if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newPin.every(digit => digit !== '') && index === 5) {
      setTimeout(() => handleSubmit(newPin), 300);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const digits = pasteData.replace(/\D/g, '').slice(0, 6);

    const newPin = ['', '', '', '', '', ''];
    digits.split('').forEach((digit, i) => {
      if (i < 6) newPin[i] = digit;
    });
    setPin(newPin);

    // Focus on last filled input
    const lastIndex = Math.min(digits.length - 1, 5);
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (pinArray = pin) => {
    const pinValue = pinArray.join('');

    if (pinValue.length !== 6) {
      setError('Vui lòng nhập đủ 6 số');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await managerAPI.verifyPin(pinValue);
      
      if (response.data.token) {
        localStorage.setItem('managerToken', response.data.token);
        navigate('/manager/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Mã PIN không chính xác');
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 sm:p-6">
      {/* Modal Container */}
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#211c34] shadow-2xl dark:shadow-black/30 p-8 text-center flex flex-col items-center">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>

        {/* HeadlineText */}
        <h1 className="text-gray-900 dark:text-white tracking-tight text-2xl sm:text-3xl font-bold leading-tight pb-2">
          Truy cập Manager
        </h1>

        {/* BodyText */}
        <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pb-8">
          Nhập mã PIN 6 số để tiếp tục
        </p>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Input */}
        <div className="flex justify-center w-full pb-8">
          <div className="relative flex gap-2 sm:gap-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-lg border-2 border-gray-300 dark:border-[#403b54] bg-white dark:bg-[#2b2839] text-gray-900 dark:text-white text-center text-2xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-6">
            <Loader className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex w-full pb-4">
          <button
            onClick={() => handleSubmit()}
            disabled={loading || pin.some(digit => digit === '')}
            className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#211c34] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">Xác nhận</span>
          </button>
        </div>

        {/* Info Text */}
        <div className="pt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Mã PIN được gửi đến email quản trị viên</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
