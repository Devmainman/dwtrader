import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from '../../../context/UserAuthContext';
import { API_BASE_URL } from '../../../api/config';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentForm from './PaymentForm';
import StatusModal from './StatusModal';

const PaymentSystem = () => {
  const { user, token } = useUserAuth(); // Destructure both user and token
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({
    show: false,
    message: '',
    type: '' // 'success' or 'error'
  });

  const showStatusModal = (message, type) => {
    setModal({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setModal({ ...modal, show: false });
    }, 5000);
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        // Verify token exists (using the token from context)
        if (!token) {
          throw new Error('Authentication token not found. Please login.');
        }

        setLoading(true);
        setError('');

        console.log('Using token:', token.substring(0, 6) + '...'); // Log first 6 chars for verification

        const response = await axios.get(
          `${API_BASE_URL}/payments/methods`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Use token from context
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('API Response:', response.data);

        // Handle both response formats
        const methodsData = response.data?.data || response.data;

        if (!Array.isArray(methodsData)) {
          throw new Error('Server returned invalid data format');
        }

        setMethods(methodsData);
      } catch (err) {
        console.error('Payment methods fetch failed:', {
          error: err,
          response: err.response?.data,
          status: err.response?.status
        });
        
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if token exists
    if (token) {
      fetchPaymentMethods();
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [token]); // Dependency on token instead of user


  // Render states
  if (!user || !token) {
    return (
      <div className="text-red-500 p-4">
        Please login to access payment methods
        <button
          onClick={() => window.location.href = '/login'} // Redirect to login
          className="ml-2 bg-blue-500 px-3 py-1 rounded text-white"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white p-4">Loading payment methods...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 bg-blue-500 px-3 py-1 rounded text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:w-[1050px] text-white relative">
      {/* Status Modal */}
      {modal.show && (
        <StatusModal 
          message={modal.message} 
          type={modal.type} 
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}

      <div className="w-full px-4 xl:px-0">
        {!selectedMethod ? (
          <PaymentMethodSelector
            methods={methods}
            onSelect={setSelectedMethod}
          />
        ) : (
          <PaymentForm
            method={methods.find(m => m.methodId === selectedMethod)}
            onBack={() => setSelectedMethod(null)}
            onDepositResult={showStatusModal} // Pass callback
          />
        )}
      </div>
    </div>
  );
};

export default PaymentSystem;