"use client";
import * as React from "react";

// NavItem component for regular navigation items
const NavItem = ({ icon, label }) => {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <div className="flex justify-center items-center">
        <div dangerouslySetInnerHTML={{ __html: icon }} />
      </div>
      <div className="text-[xs] text-center text-zinc-100 max-sm:text-xs">
        {label}
      </div>
    </div>
  );
};

// MainButton component for the center button
const MainButton = ({ icon }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: icon }} />
    </div>
  );
};

// Main NavigationBar component
function NavigationBar() {
  // SVG icons as HTML strings
  const homeIcon = `<svg id="235:1051" layer-name="vuesax/linear/home" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="home-icon" style="width: 24px; height: 24px"> <path d="M10.57 2.81985L3.64002 8.36985C2.86002 8.98985 2.36002 10.2998 2.53002 11.2798L3.86002 19.2398C4.10002 20.6598 5.46002 21.8098 6.90002 21.8098H18.1C19.53 21.8098 20.9 20.6498 21.14 19.2398L22.47 11.2798C22.63 10.2998 22.13 8.98985 21.36 8.36985L14.43 2.82985C13.36 1.96985 11.63 1.96985 10.57 2.81985Z" stroke="#EFEFEF" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.5 18V15" stroke="#F3F3F3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>`;

  const tradeIcon = `<svg id="235:1059" layer-name="vuesax/linear/trend-up" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="trade-icon" style="width: 24px; height: 24px"> <path d="M9.5 22H15.5C20.5 22 22.5 20 22.5 15V9C22.5 4 20.5 2 15.5 2H9.5C4.5 2 2.5 4 2.5 9V15C2.5 20 4.5 22 9.5 22Z" fill="url(#paint0_linear_235_1059)" stroke="url(#paint1_linear_235_1059)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17 9.5L12.8 13.7L11.2 11.3L8 14.5" stroke="#EFEFEF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15 9.5H17V11.5" stroke="#EFEFEF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <defs> <linearGradient id="paint0_linear_235_1059" x1="9.98538" y1="40.2857" x2="29.2195" y2="37.0425" gradientUnits="userSpaceOnUse"> <stop stop-color="#EB25C6"></stop> <stop offset="1" stop-color="#F5852F"></stop> </linearGradient> <linearGradient id="paint1_linear_235_1059" x1="9.98538" y1="40.2857" x2="29.2195" y2="37.0425" gradientUnits="userSpaceOnUse"> <stop stop-color="#EB25C6"></stop> <stop offset="1" stop-color="#F5852F"></stop> </linearGradient> </defs> </svg>`;

  const mainIcon = `<svg id="235:1067" width="113" height="70" viewBox="0 0 113 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="main-icon" style="width: 48px; height: 48px"> <g filter="url(#filter0_di_235_1067)"> <rect x="32.5" y="11" width="48" height="48" rx="24" fill="#F3F3F3" shape-rendering="crispEdges"></rect> <path d="M65.7156 39.9913L67.6452 37.9915M45.3153 31.7106L49.4445 27.4459M52.9732 23.6271L52.977 23.7702M60.5511 45.3438L60.4621 45.2888M45.6765 38.6921L45.7049 38.6627M48.6337 42.9683L52.5643 38.9095M49.5357 34.6925L60.0773 23.7527M53.223 45.5679L67.4823 30.7899M56.3951 34.9393L64.596 26.4401" stroke="#E8742A" stroke-width="1.71224" stroke-miterlimit="3" stroke-linecap="round"></path> </g> <defs> <filter id="filter0_di_235_1067" x="0.5" y="-21" width="112" height="112" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix> <feOffset></feOffset> <feGaussianBlur stdDeviation="16"></feGaussianBlur> <feComposite in2="hardAlpha" operator="out"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0.145098 0 0 0 0 0.388235 0 0 0 0 0.921569 0 0 0 0.68 0"></feColorMatrix> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_235_1067"></feBlend> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_235_1067" result="shape"></feBlend> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix> <feOffset></feOffset> <feGaussianBlur stdDeviation="4.15"></feGaussianBlur> <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0.0301389 0 0 0 0 0.437272 0 0 0 0 0.904167 0 0 0 0.56 0"></feColorMatrix> <feBlend mode="normal" in2="shape" result="effect2_innerShadow_235_1067"></feBlend> </filter> </defs> </svg>`;

  const walletIcon = `<svg id="I235:1072;5:5318" layer-name="vuesax/outline/empty-wallet" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="wallet-icon" style="width: 24px; height: 24px"> <path d="M17.6916 15.1393L17.6915 15.1393L17.6921 15.1452C17.7786 16.0976 18.6579 16.79 19.6 16.79H21.5C21.6339 16.79 21.75 16.9061 21.75 17.04V18.23C21.75 20.4546 19.9531 22.25 17.74 22.25H6.26C4.04614 22.25 2.25 20.4538 2.25 18.24V11.51C2.25 9.29615 4.04614 7.5 6.26 7.5H17.74C19.9539 7.5 21.75 9.29615 21.75 11.51V12.95C21.75 13.0839 21.6339 13.2 21.5 13.2H19.48C19.0062 13.2 18.554 13.3768 18.2229 13.72L18.2193 13.7236C17.8286 14.1025 17.6505 14.6199 17.6916 15.1393ZM21.25 17.8V17.3H20.75H19.6C18.3288 17.3 17.285 16.3587 17.1883 15.1985L17.1883 15.1985L17.1876 15.1914C17.1227 14.526 17.3652 13.8637 17.8606 13.3765L17.8606 13.3766L17.8669 13.3702C18.2911 12.9378 18.8617 12.7 19.48 12.7H20.75H21.25V12.2V11.51C21.25 9.57387 19.6761 8 17.74 8H6.26C4.32386 8 2.75 9.57387 2.75 11.51V18.24C2.75 20.1761 4.32386 21.75 6.26 21.75H17.74C19.6761 21.75 21.25 20.1761 21.25 18.24V17.8Z" stroke="#EFEFEF"></path> <path d="M12.1967 1.93773L12.1968 1.9377C12.8647 1.68519 13.6003 1.77616 14.1721 2.17886L14.1721 2.17887L14.1748 2.18074C14.7596 2.58686 15.1 3.2431 15.1 3.95005V7.75003C15.1 7.88389 14.9839 8.00003 14.85 8.00003C14.7161 8.00003 14.6 7.88389 14.6 7.75003V3.95005C14.6 3.40715 14.3404 2.90228 13.8833 2.58801C13.433 2.27849 12.8808 2.20194 12.3612 2.40307L4.42328 5.4023L4.42328 5.4023L4.42128 5.40306C3.41983 5.78633 2.74 6.76069 2.74 7.84006V12.41H2.73986L2.74014 12.4219C2.74319 12.5499 2.64062 12.66 2.5 12.66C2.36614 12.66 2.25 12.5439 2.25 12.41V7.84006C2.25 6.55984 3.05964 5.39453 4.25741 4.93747C4.25765 4.93738 4.25789 4.93729 4.25814 4.9372L12.1967 1.93773Z" stroke="#EFEFEF"></path> <path d="M17.1882 15.1987L17.1883 15.1986L17.1877 15.1922C17.1224 14.5153 17.3659 13.8531 17.8605 13.3667L17.8606 13.3668L17.8669 13.3603C18.2802 12.939 18.8503 12.7002 19.47 12.7002H21.5418C22.2649 12.7256 22.8 13.2893 22.8 13.9702V16.0302C22.8 16.7162 22.2598 17.2749 21.5715 17.3002H19.6C18.3288 17.3002 17.2849 16.3589 17.1882 15.1987ZM21.5612 13.2012L21.5456 13.2002H21.53H19.48C19.0075 13.2002 18.5566 13.376 18.2258 13.7172C17.8349 14.0985 17.6372 14.6242 17.6924 15.159C17.7808 16.1095 18.659 16.8002 19.6 16.8002H21.56C21.9905 16.8002 22.31 16.4313 22.31 16.0302V13.9702C22.31 13.5056 21.9311 13.2243 21.5612 13.2012Z" stroke="#EFEFEF"></path> <path d="M14 12.25H7C6.86614 12.25 6.75 12.1339 6.75 12C6.75 11.8661 6.86614 11.75 7 11.75H14C14.1339 11.75 14.25 11.8661 14.25 12C14.25 12.1339 14.1339 12.25 14 12.25Z" stroke="#EFEFEF"></path> </svg>`;

  const profileIcon = `<svg id="235:1075" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="profile-icon" style="width: 24px; height: 24px; padding: 5px"> <path d="M12 15.527C13.8799 15.527 15.5235 15.6827 16.6732 16.0899C17.2431 16.2918 17.639 16.5375 17.8871 16.8083C18.1198 17.0621 18.25 17.366 18.25 17.7739C18.25 18.1805 18.1195 18.4822 17.8866 18.734C17.6376 19.0031 17.2402 19.2469 16.6685 19.4466C15.5151 19.8494 13.8708 19.9998 12 19.9998C10.1205 19.9998 8.47696 19.844 7.32708 19.4368C6.75713 19.235 6.36111 18.9893 6.11294 18.7185C5.88025 18.4646 5.75 18.1607 5.75 17.7529C5.75 17.3463 5.88045 17.0446 6.11342 16.7928C6.36236 16.5237 6.75978 16.2799 7.33155 16.0802C8.48485 15.6774 10.1292 15.527 12 15.527ZM12 4C14.1579 4 15.8822 5.72432 15.8822 7.87961C15.8822 10.0351 14.1577 11.7601 12 11.7601C9.84311 11.7601 8.11776 10.035 8.11776 7.87961C8.11776 5.72441 9.84292 4 12 4Z" stroke="#EFEFEF" stroke-width="1.5"></path> </svg>`;

  return (
    <nav className="fixed bottom-10 flex justify-center items-center py-3 pr-6 pl-5 border-2 border-fuchsia-600 border-solid bg-zinc-800 h-[70px] rounded-[50px] w-[342px] max-md:w-[300px] max-sm:px-4 max-sm:py-2 max-sm:h-[60px] max-sm:w-[280px]">
      <div className="flex gap-7 items-center h-12 w-[298px] max-md:gap-5 max-sm:gap-4">
        <NavItem icon={homeIcon} label="Home" />
        <NavItem icon={tradeIcon} label="Trade" />
        <MainButton icon={mainIcon} />
        <NavItem icon={walletIcon} label="Support" />
        <NavItem icon={profileIcon} label="Profile" />
      </div>
    </nav>
  );
}

export default NavigationBar;
