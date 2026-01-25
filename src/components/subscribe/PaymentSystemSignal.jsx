import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useUserAuth } from '../../context/UserAuthContext';
import { API_BASE_URL } from '../../api/config';
import PaymentMethodSelector from './PaymentMethodSelectorsignal';
import PaymentForm from './PaymentFormSignal';
import StatusModal from './StatusModal';

const PaymentSystemSignal = () => {
  const { user, token } = useUserAuth();
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({
    show: false,
    message: '',
    type: ''
  });

  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("packageId");

  useEffect(() => {
    if (!packageId) {
      setError("Missing signal package ID. Please go back and select a package.");
    }
  }, [packageId]);

  const showStatusModal = (message, type) => {
    setModal({ show: true, message, type });

    setTimeout(() => {
      setModal(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        if (!token) throw new Error('Authentication token not found');

        setLoading(true);
        setError('');

        const response = await axios.get(
          `${API_BASE_URL}/payments/methods`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const methodsData = response.data?.data || response.data;

        if (!Array.isArray(methodsData)) {
          throw new Error('Server returned invalid data format');
        }

        setMethods(methodsData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPaymentMethods();
    else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [token]);

  if (!user || !token) {
    return (
      <div className="text-red-500 p-4">
        Please login to access payment methods
        <button
          onClick={() => window.location.href = '/login'}
          className="ml-2 bg-blue-500 px-3 py-1 rounded text-white"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) return <div className="text-white p-4">Loading payment methods...</div>;

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
      {modal.show && (
        <StatusModal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal(prev => ({ ...prev, show: false }))}
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
            onDepositResult={showStatusModal}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentSystemSignal;
