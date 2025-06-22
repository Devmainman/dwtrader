const WithdrawalMethod = ({ methods, onSelect }) => {
    console.log('Methods in selector:', methods); // Should show your 3 methods
    console.log('First method details:', methods[0]?.details); // Check structure
  
    return (
      <div className="py-6">
        <h2 className="text-xl font-medium mb-6">Select Payment Method</h2>
        
        {methods && methods.length > 0 ? (
          <div className="space-y-4">
            {methods.map((method) => {
              console.log('Rendering method:', method.methodId); // Check each method
              return (
                <div
                  key={method._id}
                  onClick={() => {
                    console.log('Selected method:', method.methodId); // Verify selection
                    onSelect(method.methodId);
                  }}
                  className="p-4 rounded-lg border border-[#505050] bg-[#242426] hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-700 p-2 rounded-full">
                      {method.icon ? (
                        <img 
                          src={`/icons/${method.icon.toLowerCase().replace(/\s+/g, '-')}.svg`} 
                          alt={method.title} 
                          className="h-6 w-6" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/icons/default.svg';
                          }}
                        />
                      ) : (
                        <span>💰</span>
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
          <div className="border border-yellow-500 p-4">
            <p className="text-yellow-500">Debug: Methods array exists but empty</p>
            <pre className="text-xs mt-2">{JSON.stringify(methods, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };
  
  export default WithdrawalMethod;