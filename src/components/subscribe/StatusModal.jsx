import { useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const StatusModal = ({
  message,
  type = 'info',
  onClose,
  title,
  buttonLabel = 'Close',
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const themes = {
    success: {
      color: 'text-green-500',
      bar: 'bg-green-500',
      Icon: CheckCircle,
      title: title || 'Success!',
    },
    error: {
      color: 'text-red-500',
      bar: 'bg-red-500',
      Icon: XCircle,
      title: title || 'Error!',
    },
    warning: {
      color: 'text-yellow-500',
      bar: 'bg-yellow-500',
      Icon: AlertTriangle,
      title: title || 'Warning!',
    },
    info: {
      color: 'text-blue-500',
      bar: 'bg-blue-500',
      Icon: Info,
      title: title || 'Info',
    },
  };

  const { color, bar, Icon, title: resolvedTitle } = themes[type] || themes.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl p-5 bg-[#161617] shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <Icon className={`w-6 h-6 mr-3 mt-1 ${color}`} />
            <div>
              <h2 className={`text-lg font-semibold mb-1 ${color}`}>{resolvedTitle}</h2>
              <p className="text-sm text-[#e0e0e0]">{message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-[#a0a0a0] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-[#ffffff20] rounded-full overflow-hidden">
          <div className={`h-full ${bar} animate-progress`} />
        </div>

        {/* Optional action button */}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-white text-black py-1 px-4 rounded-full text-sm font-medium hover:bg-gray-100 transition-all"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
