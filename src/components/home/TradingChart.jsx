"use client";
import React from "react";
import ChartTabs from "./ChartTabs";
import ChartToolbar from "./ChartToolbar";

function TradingChart() {
  return (
    <section className="mt-6 w-full">
      <ChartTabs />
      <div className="flex flex-col justify-center p-px w-full bg-gray-800 rounded-sm border-solid border-[0.52px] border-[color:var(--script-viserlab-com-tuna,#363A45)] min-h-[217px] min-w-[125px]">
        <div className="flex flex-col justify-center w-full min-h-5">
          <div className="flex-1 w-full">
            <div className="flex overflow-hidden flex-col justify-center w-full min-h-5">
              <div className="overflow-hidden flex-1 w-full">
                <div className="overflow-hidden pb-1 min-h-[px]">
                  <div className="flex-1 w-full">
                    <ChartToolbar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden flex-col justify-center w-full min-h-[196px]">
          <div className="flex overflow-hidden flex-col flex-1 justify-center w-full bg-gray-900">
            <div className="overflow-hidden w-full min-h-[196px]">
              <div className="flex items-start w-full">
                <div className="flex overflow-hidden relative justify-center items-start px-0.5 max-w-[480px] min-h-[182px] min-w-60 w-[480px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/43b62acaf7ba131bbc84ee3c0ac4db9daea605b2423f1fc2eaa1d06f3b0239da?placeholderIfAbsent=true"
                    className="object-contain absolute right-0 bottom-0 z-0 aspect-[1.72] h-[182px] min-w-60 w-[480px]"
                    alt="Chart background"
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4f1f06f7a8ec0fe8a2c6b4f0acf783ccf068bbe218c522dcdcdfb98e0fae8a2?placeholderIfAbsent=true"
                    className="object-contain absolute right-0 bottom-0 z-0 aspect-[1.72] h-[182px] min-w-60 w-[480px]"
                    alt="Chart overlay"
                  />
                  <div className="z-0 flex-1 shrink pt-0.5 basis-0 max-w-[307px] min-w-60">
                    <div className="flex flex-col justify-center items-start w-full max-w-[307px] min-h-3">
                      <div className="flex h-3">
                        <div className="flex overflow-hidden items-center py-px pr-0.5 pl-px h-full bg-gray-900 bg-opacity-50 max-w-[164px] min-h-3 min-w-3">
                          <div className="flex gap-0.5 items-center self-stretch py-px pl-px my-auto min-h-2.5 min-w-3">
                            <div className="flex items-start self-stretch my-auto w-[9px]">
                              <img
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/113690dd451dda1b56627ff28e13f58855fff754521b0a73771080d4b58f20d6?placeholderIfAbsent=true"
                                className="object-contain w-2.5 aspect-[1.11]"
                                alt="Bitcoin icon"
                              />
                            </div>
                            <div className="overflow-hidden self-stretch pb-px my-auto text-xs text-gray-300">
                              Bitcoin / TetherUS
                            </div>
                          </div>
                          <div className="flex relative gap-1.5 items-start self-stretch py-px pl-1.5 my-auto text-xs text-gray-300 whitespace-nowrap min-h-2.5">
                            <div className="absolute bottom-0 left-0 top-px z-0 self-start w-1.5 text-center min-h-[11px]">
                              ·
                            </div>
                            <div className="overflow-hidden z-0 pb-px my-auto">
                              1D
                            </div>
                          </div>
                          <div className="flex relative gap-1.5 items-start self-stretch py-px pl-1.5 my-auto text-xs text-gray-300 whitespace-nowrap min-h-2.5 min-w-3">
                            <div className="absolute bottom-0 left-0 top-px z-0 self-start w-1.5 text-center min-h-[11px]">
                              ·
                            </div>
                            <div className="overflow-hidden z-0 pb-px my-auto">
                              BINANCE
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center px-1.5 py-0.5 h-full bg-gray-900 bg-opacity-50">
                          <div className="flex overflow-hidden items-start self-stretch my-auto rounded-md min-w-[3px] w-[9px]">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/355e99c7c7c2d2f7884002008a8db429181bc626b28eea120e9917dddb04e369?placeholderIfAbsent=true"
                              className="object-contain aspect-square min-h-[9px] w-[9px]"
                              alt="Settings icon"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex overflow-hidden items-center py-px text-xs bg-gray-900 bg-opacity-50 min-h-[9px] min-w-3">
                        <div className="flex overflow-hidden items-start self-stretch pl-0.5 my-auto">
                          <div className="flex items-center pr-1 whitespace-nowrap">
                            <span className="self-stretch my-auto text-gray-300">
                              O
                            </span>
                            <span className="self-stretch my-auto text-red-500">
                              57,339.89
                            </span>
                          </div>
                          <div className="flex items-center pr-1 whitespace-nowrap">
                            <span className="self-stretch pr-px my-auto text-gray-300">
                              H
                            </span>
                            <span className="self-stretch my-auto text-red-500">
                              57,571.86
                            </span>
                          </div>
                          <div className="flex items-center pr-1 whitespace-nowrap">
                            <span className="self-stretch my-auto text-gray-300">
                              L
                            </span>
                            <span className="self-stretch my-auto text-red-500">
                              56,542.47
                            </span>
                          </div>
                          <div className="flex items-center pr-1 whitespace-nowrap">
                            <span className="self-stretch my-auto text-gray-300">
                              C
                            </span>
                            <span className="self-stretch my-auto text-red-500">
                              57,166.20
                            </span>
                          </div>
                          <div className="flex items-center pr-1 text-red-500">
                            <span className="self-stretch my-auto">
                              −173.69 (−0.30%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex-1 w-full text-xs">
                        <div className="flex w-full max-w-[307px] min-h-3">
                          <div className="flex overflow-hidden items-center p-0.5 h-full text-gray-300 bg-gray-900 bg-opacity-50 max-w-[33px]">
                            <div className="overflow-hidden self-stretch my-auto">
                              Vol · BTC
                            </div>
                          </div>
                          <div className="flex overflow-hidden items-center py-0.5 h-full text-red-500 bg-gray-900 bg-opacity-50">
                            <div className="overflow-hidden self-stretch pl-0.5 my-auto">
                              <div className="flex items-center pr-1">
                                <span className="self-stretch my-auto">
                                  9.791 K
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start self-start pt-px pl-0.5">
                        <div className="flex items-center py-px pl-px rounded-sm border-solid bg-gray-900 bg-opacity-80 border-[0.52px] border-[color:var(--script-viserlab-com-tuna,#363A45)]">
                          <div className="flex justify-center items-center self-stretch px-1 py-px my-auto w-3.5 min-h-2.5 rotate-[3.141592653589793rad]">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0748abff47e5c7b7386f98d6f24d684df31c796dedb90abc193e223b94c0d882?placeholderIfAbsent=true"
                              className="object-contain self-stretch my-auto w-2 aspect-square"
                              alt="Hide indicator"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden min-w-[37px] w-[37px]">
                  <div className="flex overflow-hidden relative flex-col aspect-[0.204] w-[37px]">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/91d0512fb076deff5ab2d56099887dd7ea280ab40ef21ca65ea46d70a0666648?placeholderIfAbsent=true"
                      className="object-cover absolute inset-0 size-full"
                      alt="Chart scale background"
                    />
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/f3e56c62cc7b9225cee6a546b68e967d51a9ab62de9f7d5285ffbe17bbe86a9a?placeholderIfAbsent=true"
                      className="object-contain w-full aspect-[0.2]"
                      alt="Chart scale"
                    />
                  </div>
                </div>
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/00f20515348201bcd1710bfa06aea81b73652d69d52b11fc5aa0d624a41a4067?placeholderIfAbsent=true"
                className="object-contain w-full aspect-[23.26]"
                alt="Chart timeline"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TradingChart;
