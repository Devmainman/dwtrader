
import { STATIC_BASE_URL } from '../../../api/config';
import { Wallet as WalletIcon } from "lucide-react";

const PaymentMethodSelector = ({ methods, onSelect }) => {
  console.log('Methods in selector:', methods);
  console.log('First method details:', methods[0]?.details);

  return (
    <div className="py-6 mx-5 lg:mx-[0px] lg:w-[1060px]">
      <h2 className="text-base text-[var(--fg-2)] mb-6">Select Payment Method</h2>

      {methods && methods.length > 0 ? (
        <div className="grid gap-4 text-[var(--fg-2)] text-sm sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((method) => {
            // Fix icon URL: Use STATIC_BASE_URL and handle /icons prefix
            const iconUrl = method.icon 
              ? `${STATIC_BASE_URL}${method.icon.replace(/^\/icons\//, '/icons/')}`
              : '/icons/default.png';
            console.log('Rendering method:', method.methodId, 'Icon URL:', iconUrl);

            return (
              <div
                key={method._id}
                onClick={() => {
                  console.log('Selected method:', method.methodId);
                  onSelect(method.methodId);
                }}
                className="p-4 rounded-xl h-[80px] border border-[var(--line-strong)] bg-[var(--card-2)] hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-gray-700 p-2 rounded-full">
                    {method.icon ? (
                      <img
                        src={iconUrl}
                        alt={method.title}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          console.log('Icon load error:', iconUrl);
                          e.target.onerror = null;
                          e.target.src = '/icons/default.png';
                        }}
                      />
                    ) : (
                      <WalletIcon className="w-5 h-5 text-neutral-300" strokeWidth={1.8} />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{method.title}</p>
                    {method.processingTime && (
                      <p className="text-xs text-gray-400">{method.processingTime}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--card)] border border-neutral-800 px-4 py-8 text-center">
          <p className="text-sm text-zinc-100">No deposit methods yet</p>
          <p className="text-xs text-neutral-500 mt-1">Deposit options will appear here once support adds them.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;