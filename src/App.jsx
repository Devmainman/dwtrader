import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from './context/UserAuthContext';
import axios from 'axios';
import { API_BASE_URL } from './api/config';
import { paintMode, getMode } from './lib/theme';

// Mobile Components
import HomeDashboardMobile from "./components/home/HomeDashboard";
import SettingsProfileMobile from "./components/profile/SettingsProfile";
import TopNavBarMobile from "./components/navigation/TopNavBar";
import TradeUIMobile from "./components/trade/TradeUI";
import MarketSection from "./components/trade/MarketSection/MarketSection";
import SupportMobile from "./components/support/Support";
import OpenSupportMobile from "./components/support/OpenSupport";
import SideBarMobile from "./components/sidebar/SideBar";
import DesktopSidebar from "./components/desktop/DesktopSidebar";
import NotificationMobile from "./components/notification/index";
import DepositeStageMobile from "./components/wallet/DepositChooser";
import WalletPage from "./components/wallet/WalletPage";
import CryptoDeposit from "./components/wallet/CryptoDeposit";
import Convert from "./components/wallet/Convert";
import WithdrawPage from "./components/withdrawal/withdrawalsystem/WithdrawalSystem";
import TransactionHistoryMobile from "./components/transactionhistory/TransactionHistoryScreen";
import AccountUpgradeMobile from "./components/accountupgrade/AccountUpgrade1";
import AccountReferralMobile from "./components/referrals/AccountReferral1";
import CopyTradingMobile from "./components/copytrade/CopyTrading";
import CopyTradingPositions from "./components/copytrade/CopyTradingPositions";
import MiningMobile from "./components/mining/Mining";

// Desktop Components
import HomeDashboardDesktop from "./desktopcomponents/home/HomeDashboard1";
import SettingsProfileDesktop from "./desktopcomponents/profile/ProfileInformation";
import TradeUIDesktop from "./desktopcomponents/trade/TradingActivities";
import MarketSectionDesktop from "./components/trade/MarketSection/MarketSection";
import SupportDesktop from "./desktopcomponents/support/SupportTicket";
import DepositeStageDesktop from "./desktopcomponents/Deposite/PaymentMethod";
import WithdrawDesktop from "./desktopcomponents/withdraw/SelectWithdrawalMethod";
import NotificationDesktop from "./desktopcomponents/notification/Notification";
import TransactionHistoryDesktop from "./desktopcomponents/transactionhistory/TransactionHistory";
import AccountUpgradeDesktop from "./desktopcomponents/upgradeaccount/UpgradeAccount";
import AccountReferralDesktop from "./desktopcomponents/referrals/Referrals";
import OpenSupportDesktop from "./desktopcomponents/support/OpenSupportDesktop";
import CopyTradingDesktop from "./components/copytrade/CopyTrading";
import CopyTradingPositionsDesktop from "./components/copytrade/CopyTradingPositions";
import TraderProfile from "./components/copytrade/TraderProfile";
import MiningDesktop from "./components/mining/Mining";
import SignalPackage1 from "./components/signals/SignalPackage1";

// Trading & mining
import LiveTrading from "./components/trading/LiveTrading";
import TradingHub from "./components/trading/TradingHub";
import MiningPage from "./components/mining/MiningPage";

// Wealth products
import Investing from "./components/products/Investing";
import Assets from "./components/products/Assets";
import Staking from "./components/products/Staking";
import RealEstate from "./components/products/RealEstate";
import RealEstateProject from "./components/products/RealEstateProject";
import ColdStorage from "./components/products/ColdStorage";
import Cards, { CardActivation } from "./components/products/Cards";
import Rewards from "./components/products/Rewards";
import SmartTrader from "./components/products/SmartTrader";
import WalletConnect from "./components/products/WalletConnect";

// Layouts
import DesktopLayout from "./desktopcomponents/DesktopLayout";
import { SidebarProvider } from "./context/SidebarContext";
import { UserAuthProvider } from './context/UserAuthContext';
import { BalanceProvider } from './context/BalanceContext';
import { NotificationProvider } from './context/NotificationContext';
import UserPopupHandler from './components/UserPopupHandler';
import Navbar from "./Navbar";
import VerificationStatusModal from './components/VerificationStatusModal';
import BlockedNoticeModal from './components/BlockedNoticeModal';
import { LimitBanner, LiveNotificationBanner } from './components/notice/AppNotices';

import PackageUpgradeModal from './components/PackageUpgradeModal';
import PaymentSystem from './components/subscribe/PaymentSystem';
import PaymentSystemSignal from "./components/subscribe/PaymentSystemSignal";

// Auth Pages
import LoginPage from "./desktopcomponents/authpages/loginpage/LoginScreen";
import Landing from "./landing/Landing";
import { BlogIndex, BlogPostPage } from "./landing/Blog";
import { HelpIndex, HelpCategoryPage } from "./landing/Help";
import SignupPage from "./desktopcomponents/authpages/signup/SignUpForm";
import WelcomePage from "./desktopcomponents/authpages/welcome/InputDesign";

function AppContent() {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    emailRequested: false,
    phoneRequested: false
  });
  // One shell for every screen size: the mobile layout (the desktop shell is retired).
  const [isMobile, setIsMobile] = useState(true);
  const [showPackagePopup, setShowPackagePopup] = useState(false);

  const location = useLocation();
  const { user, loading, error, token, loggingOut } = useUserAuth();

  const [prevPackage, setPrevPackage] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [newPackage, setNewPackage] = useState(null);
  const { refreshUser } = useUserAuth();
  





  useEffect(() => {
    if (!user) return;
  
    if (prevPackage && user.accountType !== prevPackage) {
      setNewPackage(user.accountType);
      setShowUpgradeModal(true);
    }
  
    // Update stored package for future comparisons
    if (user.accountType) {
      setPrevPackage(user.accountType);
    }
  }, [user?.accountType]);



  useEffect(() => {
    if (!user || !token) return;
  
    const sendVisit = async () => {
      try {
        await axios.post(`${API_BASE_URL}/history/record`, {
          url: window.location.pathname,
          timestamp: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to record page visit:", err);
      }
    };
  
    sendVisit();
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => setIsMobile(true);
    window.addEventListener("resize", handleResize);

    if (user?.verification) {
      const { emailVerified, phoneVerified, emailVerificationToken, phoneVerificationCode } = user.verification;
      const emailReq = emailVerificationToken && !emailVerified;
      const phoneReq = phoneVerificationCode && !phoneVerified;
      if (emailReq || phoneReq) {
        setVerificationStatus({ emailRequested: emailReq, phoneRequested: phoneReq });
        setShowVerificationModal(true);
      }
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log("User isOnline status:", user.isOnline);
    }
  }, [user]);


useEffect(() => {
  console.log("Checking package popup conditions...");
  if (!user || !user.pendingPackage?._id) return;

  const seen = localStorage.getItem(`seenPackage_${user.pendingPackage._id}`);
  console.log("Package ID:", user.pendingPackage._id);
  console.log("Seen in localStorage:", seen);
  console.log("Payment started:", user.packagePaymentStarted);

  // SHOW popup only if not seen and not started
  if (user.pendingPackage && !user.packagePaymentStarted) {
    setShowPackagePopup(true);
  } else {
    setShowPackagePopup(false); // Ensure modal is closed
  }
}, [user]);





  const isAuthRoute = ['/auth', '/signup', '/welcome'].includes(location.pathname);
  const isSignupRoute = location.pathname === '/signup';
  const isWelcomeRoute = location.pathname === '/welcome';
  // Light mode is for the signed-in app; public pages (landing, blog, help, sign-in) stay dark.
  const publicPage = !token || isAuthRoute || ['/', '/landing'].includes(location.pathname)
    || location.pathname.startsWith('/blog') || location.pathname.startsWith('/help');
  useEffect(() => { paintMode(getMode(), { force: publicPage }); }, [publicPage]);

  // 1. Global loading first
  if (loading.global) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

 

  if (loggingOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--card)] text-white">
        <div className="text-center space-y-3">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-pink-500 rounded-full mx-auto"></div>
          <p className="text-lg font-semibold">Logging you out...</p>
        </div>
      </div>
    );
  }
  

  // Public landing at "/" for everyone (and "/landing"); the dashboard lives at /dashboard.
  if (location.pathname === '/' || location.pathname === '/landing') {
    return <Landing />;
  }
  // Public blog (no login needed), styled like the landing page.
  if (location.pathname === '/blog' || location.pathname === '/blog/') return <BlogIndex />;
  if (location.pathname.startsWith('/blog/')) {
    return <Routes><Route path="/blog/:slug" element={<BlogPostPage />} /></Routes>;
  }
  // Public Help Center (FAQ), same look.
  if (location.pathname === '/help' || location.pathname === '/help/') return <HelpIndex />;
  if (location.pathname.startsWith('/help/')) {
    return <Routes><Route path="/help/:slug" element={<HelpCategoryPage />} /></Routes>;
  }

  if (!token && !isAuthRoute && !loggingOut) {
    return <Navigate to="/auth" replace />;
  }
  
  

  if (token && isAuthRoute && !isSignupRoute && !isWelcomeRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      {user?.status === 'Inactive' && (
    <BlockedNoticeModal reason={user?.blockReason || 'Your account has been restricted temporarily.'} />
  )}
      <LiveNotificationBanner />
      {isMobile ? (
        <>
          <VerificationStatusModal
            show={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            emailRequested={verificationStatus.emailRequested}
            phoneRequested={verificationStatus.phoneRequested}
          />

          <PackageUpgradeModal
            show={showPackagePopup}
            onClose={() => {
              if (user?.pendingPackage?._id) {
                localStorage.setItem(`seenPackage_${user.pendingPackage._id}`, 'true');
              }
              setShowPackagePopup(false);
            }}
            newPackage={user?.pendingPackage}
          />


          <UserPopupHandler />
          <Navbar />
          <SideBarMobile />
          {/* Desktop only (1024px+): a fixed sidebar, and the content shifted right of it. Phones are unchanged. */}
          <DesktopSidebar />
          <div className="lg:pl-[248px]">
          <TopNavBarMobile />
          <LimitBanner info={user?.thresholdInfo} />
          <section key={location.pathname} className="flex flex-col overflow-y-auto min-h-screen bg-neutral-900 page-enter app-main">
            <Routes>{appRoutes()}</Routes>
          </section>
          </div>
        </>
      ) : (
        <>
         <VerificationStatusModal
            show={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            emailRequested={verificationStatus.emailRequested}
            phoneRequested={verificationStatus.phoneRequested}
          />

          <PackageUpgradeModal
            show={showPackagePopup}
            onClose={() => {
              if (user?.pendingPackage?._id) {
                localStorage.setItem(`seenPackage_${user.pendingPackage._id}`, 'true');
              }
              setShowPackagePopup(false);
            }}
            newPackage={user?.pendingPackage}
          />

        <Routes>
          
          <Route path="/" element={<DesktopLayout />}>
            {appRoutes()}
          </Route>
        </Routes>
        </>
      )}
    </SidebarProvider>
  );
}

// One route list for every screen size: the mobile pages, made responsive.
function appRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<HomeDashboardMobile />} />
      <Route path="/payment" element={<PaymentSystem />} />
      <Route path="/signal-payment" element={<PaymentSystemSignal />} />
      <Route path="/settings" element={<SettingsProfileMobile />} />
      <Route path="/trade" element={<TradingHub />} />
      <Route path="/trademain" element={<LiveTrading />} />
      <Route path="/copytrade" element={<CopyTradingMobile />} />
      <Route path="/copy-positions" element={<CopyTradingPositions />} />
      <Route path="/copytrade/trader/:traderId" element={<TraderProfile />} />
      <Route path="/mining" element={<MiningPage />} />
      <Route path="/support" element={<SupportMobile />} />
      <Route path="/opensupport" element={<OpenSupportMobile />} />
      <Route path="/notification" element={<NotificationMobile />} />
      <Route path="/deposite" element={<DepositeStageMobile />} />
      <Route path="/deposit/crypto" element={<CryptoDeposit />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/convert" element={<Convert />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
      <Route path="/transactionhistory" element={<TransactionHistoryMobile />} />
      <Route path="/accountupgrade" element={<AccountUpgradeMobile />} />
      <Route path="/referrals" element={<AccountReferralMobile />} />
      <Route path="/signal-packages" element={<SignalPackage1 />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/invest" element={<Investing />} />
      <Route path="/staking" element={<Staking />} />
      <Route path="/real-estate" element={<RealEstate />} />
      <Route path="/real-estate/:id" element={<RealEstateProject />} />
      <Route path="/cold-storage" element={<ColdStorage />} />
      <Route path="/cards" element={<Cards />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/cards/activate/:id" element={<CardActivation />} />
      <Route path="/ai-trader" element={<SmartTrader />} />
      <Route path="/wallets" element={<WalletConnect />} />
    </>
  );
}

function App() {
  return (
    <UserAuthProvider>
      <BalanceProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </BalanceProvider>
    </UserAuthProvider>
  );
}

export default App;