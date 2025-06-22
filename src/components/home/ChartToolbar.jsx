"use client";
import React from "react";

function ChartToolbar() {
  return (
    <div className="flex w-full h-5">
      <div className="flex overflow-hidden justify-center items-center h-full bg-gray-900 min-w-[19px]">
        <div className="flex items-center self-stretch p-1.5 my-auto min-h-5 w-[52px]">
          <div className="self-stretch my-auto w-[9px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b53e41fd0b19f40cc1be377d53451e67b26da19360837eac151a8e3a2a11c962?placeholderIfAbsent=true"
              className="object-contain aspect-[0.9] w-[9px]"
              alt="Symbol search"
            />
          </div>
          <div className="self-stretch pl-px my-auto text-xs font-bold leading-none text-gray-300 uppercase whitespace-nowrap">
            <div className="overflow-hidden w-[31px]">BTCUSDT</div>
          </div>
        </div>
        <div className="flex items-center self-stretch px-0.5 py-1 my-auto min-h-5">
          <div className="self-stretch my-auto w-[15px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/aca64ab51d0cde559b97c023213f9555cbb24c9fcffa09ee8fa95c2e8b81400b?placeholderIfAbsent=true"
              className="object-contain w-full aspect-[1.07]"
              alt="Add symbol"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center px-0.5 py-1 h-full bg-gray-900">
        <div className="flex self-stretch my-auto w-px bg-gray-700 min-h-3" />
      </div>
      <div className="flex overflow-hidden justify-center items-center h-full bg-gray-900 min-w-[19px]">
        <div className="flex self-stretch my-auto min-h-5">
          <div className="flex flex-col justify-center pl-px text-xs text-gray-300 whitespace-nowrap">
            <div className="flex flex-1 items-center px-1 py-1.5 h-full">
              <div className="self-stretch my-auto w-2.5">
                <div className="w-full">1m</div>
              </div>
            </div>
          </div>
          <div className="flex items-center px-1 py-1.5 h-full text-xs text-gray-300 whitespace-nowrap">
            <div className="self-stretch my-auto w-3.5">
              <div className="w-full">30m</div>
            </div>
          </div>
          <div className="flex items-center px-1 py-1.5 h-full text-xs text-gray-300 whitespace-nowrap">
            <div className="self-stretch my-auto w-2">
              <div className="w-full">1h</div>
            </div>
          </div>
          <div className="flex flex-col justify-center pr-px text-xs text-blue-600 whitespace-nowrap">
            <div className="flex flex-1 items-center px-1 py-1.5 h-full">
              <div className="self-stretch my-auto w-[5px]">
                <div className="w-full">D</div>
              </div>
            </div>
          </div>
          <div className="flex items-center px-1 py-2.5 my-auto min-h-5">
            <div className="self-stretch my-auto w-1">
              <div className="flex items-center w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3792b8acb3b47ee91c2e55e4d5e52e466ffb79a0d07bdaca869cbcb9b2ecc677?placeholderIfAbsent=true"
                  className="object-contain flex-1 shrink self-stretch my-auto w-1 aspect-[2] basis-0"
                  alt="Time interval"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center px-0.5 py-1 h-full bg-gray-900">
        <div className="flex self-stretch my-auto w-px bg-gray-700 min-h-3" />
      </div>
      <div className="flex overflow-hidden justify-center items-center h-full bg-gray-900 min-w-[19px] w-[59px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1a431ebf230e203e89d0c7976f3be52a79fd521e4a5dcd7caa8568ec745401a8?placeholderIfAbsent=true"
          className="object-contain self-stretch my-auto aspect-[2.95] min-h-5 w-[59px]"
          alt="Chart tools"
        />
      </div>
      <div className="flex items-center px-0.5 py-1 h-full bg-gray-900">
        <div className="flex self-stretch my-auto w-px bg-gray-700 min-h-3" />
      </div>
      <div className="flex overflow-hidden justify-center items-center h-full bg-gray-900 min-w-[19px]">
        <div className="flex items-center self-stretch my-auto min-h-5">
          <div className="flex items-center self-stretch py-1 pr-1.5 pl-1 my-auto min-h-5">
            <div className="self-stretch my-auto w-[15px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e443be93700e1215ffc7f43eb61bb289d5240264fa606340e279ca79882541f3?placeholderIfAbsent=true"
                className="object-contain aspect-square w-[15px]"
                alt="Indicators"
              />
            </div>
            <div className="self-stretch pl-px my-auto text-xs text-gray-300 whitespace-nowrap">
              Indicators
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 shrink h-5 bg-gray-900 basis-0 w-[55px]" />
      <div className="flex overflow-hidden justify-center items-center h-full bg-gray-900 min-w-[19px]">
        <div className="flex items-center self-stretch px-0.5 py-1 my-auto min-h-5">
          <div className="self-stretch my-auto w-[15px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4cc766f34929612ca1dc44e5ed72c24a060db2ec35056be15d6183396fca675c?placeholderIfAbsent=true"
              className="object-contain w-full aspect-[1.07]"
              alt="Take snapshot"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartToolbar;
