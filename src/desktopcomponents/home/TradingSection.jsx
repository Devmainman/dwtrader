import React from "react";

function TradingSection() {
  return (
    <section className="w-full max-w-[866px] rounded-[20px] border border-neutral-600 bg-[#1D1D1F]">
      <nav className="flex flex-wrap gap-10 justify-between items-center px-6 py-3 text-xs border-b border-neutral-600 text-neutral-400">
        <span className="text-blue-600">Chart</span>
        <span>Order Book</span>
        <span>Market</span>
        <span>History</span>
      </nav>

      <div className="rounded-b-[20px]">
        <div className="flex flex-col md:flex-row">
          {/* Chart */}
          <div className="w-full md:w-2/3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/32228b5c936390efac69972ae30f43a66364a2dca33bb9fa59080c0fb557e00e"
              alt="Trading chart"
              className="w-full h-auto object-contain aspect-[0.89]"
            />
          </div>

          {/* Order Book */}
          <div className="w-full md:w-1/3 border-l border-neutral-600">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b4798a93f85dcebf465a478c056322305ab398258325c55a230abe481e00686"
              alt="Order book"
              className="w-full h-auto object-contain aspect-[0.44]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TradingSection;
