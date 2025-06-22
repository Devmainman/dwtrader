export default function PopupMessageModal({ popup, onComplete }) {
    const handleAcknowledge = async () => {
      try {
        await axios.patch(
          `${API_BASE_URL}/user/popup-messages/${popup.itemId}/acknowledge`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onComplete(popup._id);
      } catch (error) {
        console.error('Error acknowledging message:', error);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
        <div className="bg-[#282F36] rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{popup.title}</h3>
          <div className="text-gray-300 mb-6">
            <p>{popup.metadata?.description}</p>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleAcknowledge}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    );
  }