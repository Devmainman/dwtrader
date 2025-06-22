import { useEffect } from 'react';

const StatusModal = ({ message, type, onClose }) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  // Determine styling based on type
  const bgColor = type === 'success' 
    ? 'bg-[#2a5b45] border-green-500' 
    : 'bg-[#5b2a2a] border-red-500';
  
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50">
      <div className={`${bgColor} border rounded-xl p-6 max-w-md mx-4 shadow-lg`}>
        <div className="flex items-start">
          <span className="text-2xl mr-3">{icon}</span>
          <div>
            <h3 className="font-bold text-lg mb-1">
              {type === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p className="text-[#e0e0e0]">{message}</p>
          </div>
          
          <button 
            onClick={onClose}
            className="ml-4 text-[#a0a0a0] hover:text-white"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-[#ffffff20] rounded-full overflow-hidden">
          <div 
            className={`h-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-progress`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;