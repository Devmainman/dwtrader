export default function PopupInvoiceModal({ popup, onComplete }) {
    const handlePayment = async () => {
      try {
        // Process payment
        await axios.post(
          `${API_BASE_URL}/user/popup-invoices/${popup.itemId}/pay`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onComplete(popup._id);
      } catch (error) {
        console.error('Error processing payment:', error);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
        <div className="bg-[#282F36] rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{popup.title}</h3>
          <div className="text-gray-300 mb-6">
            <p>Amount: {popup.metadata?.amount}</p>
            {/* Other invoice details */}
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={handlePayment}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    );
  }