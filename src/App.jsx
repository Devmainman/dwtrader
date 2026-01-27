import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from './context/UserAuthContext';
import axios from 'axios';
import { API_BASE_URL } from './api/config';

// Mobile Components
import HomeDashboardMobile from "./components/home/HomeDashboard";
import SettingsProfileMobile from "./components/profile/SettingsProfile";
import TopNavBarMobile from "./components/navigation/TopNavBar";
import TradeUIMobile from "./components/trade/TradeUI";
import MarketSection from "./components/trade/MarketSection/MarketSection";
import SupportMobile from "./components/support/Support";
import OpenSupportMobile from "./components/support/OpenSupport";
import SideBarMobile from "./components/sidebar/SideBar";
import NotificationMobile from "./components/notification/index";
import DepositeStageMobile from "./components/Deposite/payment/PaymentSystem";
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
import MiningDesktop from "./components/mining/Mining";
import SignalPackage1 from "./components/signals/SignalPackage1";

// Layouts
import DesktopLayout from "./desktopcomponents/DesktopLayout";
import { SidebarProvider } from "./context/SidebarContext";
import { UserAuthProvider } from './context/UserAuthContext';
import { BalanceProvider } from './context/BalanceContext';
import UserPopupHandler from './components/UserPopupHandler';
import Navbar from "./Navbar";
import VerificationStatusModal from './components/VerificationStatusModal';
import BlockedNoticeModal from './components/BlockedNoticeModal';

import PackageUpgradeModal from './components/PackageUpgradeModal';
import PaymentSystem from './components/subscribe/PaymentSystem';
import PaymentSystemSignal from "./components/subscribe/PaymentSystemSignal";

// Auth Pages
import LoginPage from "./desktopcomponents/authpages/loginpage/LoginScreen";
import SignupPage from "./desktopcomponents/authpages/signup/SignUpForm";
import WelcomePage from "./desktopcomponents/authpages/welcome/InputDesign";

function AppContent() {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    emailRequested: false,
    phoneRequested: false
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showPackagePopup, setShowPackagePopup] = useState(false);

  const location = useLocation();
  const { user, loading, error, token, loggingOut } = useUserAuth();

  const [prevPackage, setPrevPackage] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [newPackage, setNewPackage] = useState(null);
  const { refreshUser } = useUserAuth();
  

 const renderThresholdBanner = () => {
  if (!user?.thresholdInfo) return null;

  const { nearLimit, warning, exhausted, usagePercent, threshold } = user.thresholdInfo;
  const userName = user?.fullname || user?.name || 'User';

  if (exhausted) {
    return (
      <div className="bg-red-600 text-white text-sm p-3 text-center font-semibold">
        🚫 Dear {userName}, your account has <strong>reached the maximum balance threshold</strong> ({threshold}). A <strong>compulsory account upgrade</strong> is required to proceed with further actions such as withdrawals.
      </div>
    );
  }

  if (warning) {
    return (
      <div className="bg-yellow-600 text-white text-sm p-3 text-center font-semibold">
        ⚠️ Dear {userName}, you have <strong>exceeded 80% of your account threshold</strong> ({usagePercent}%). To avoid interruptions with deposits or withdrawals, kindly upgrade your account promptly.
      </div>
    );
  }

  if (nearLimit) {
    return (
      <div className="bg-blue-600 text-white text-sm p-3 text-center font-semibold">
        ℹ️ Dear {userName}, you’ve used over 60% of your account threshold. Consider upgrading your account to avoid future limitations.
      </div>
    );
  }

  return null;
};



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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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
      console.log("✅ User isOnline status:", user.isOnline);
    }
  }, [user]);


useEffect(() => {
  console.log("➡️ Checking package popup conditions...");
  if (!user || !user.pendingPackage?._id) return;

  const seen = localStorage.getItem(`seenPackage_${user.pendingPackage._id}`);
  console.log("🧾 Package ID:", user.pendingPackage._id);
  console.log("📌 Seen in localStorage:", seen);
  console.log("✅ Payment started:", user.packagePaymentStarted);

  // SHOW popup only if not seen and not started
  if (user.pendingPackage && !user.packagePaymentStarted) {
    setShowPackagePopup(true);
  } else {
    setShowPackagePopup(false); // ✅ Ensure modal is closed
  }
}, [user]);





  const isAuthRoute = ['/auth', '/signup', '/welcome'].includes(location.pathname);
  const isSignupRoute = location.pathname === '/signup';
  const isWelcomeRoute = location.pathname === '/welcome';

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
      <div className="flex items-center justify-center min-h-screen bg-[#1D1D1F] text-white">
        <div className="text-center space-y-3">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-pink-500 rounded-full mx-auto"></div>
          <p className="text-lg font-semibold">Logging you out...</p>
        </div>
      </div>
    );
  }
  

  if (!token && !isAuthRoute && !loggingOut) {
    return <Navigate to="/auth" replace />;
  }
  
  

  if (token && isAuthRoute && !isSignupRoute && !isWelcomeRoute) {
    return <Navigate to="/" replace />;
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
      {renderThresholdBanner()}
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
          <TopNavBarMobile />
          <section className="flex flex-col overflow-y-auto min-h-screen bg-neutral-900">
            <Routes>
              <Route path="/payment" element={<PaymentSystem />} />


            
              <Route path="/" element={<HomeDashboardMobile />} />
              <Route path="/signal-payment" element={<PaymentSystemSignal />} />
              <Route path="/settings" element={<SettingsProfileMobile />} />
              <Route path="/trade" element={<TradeUIMobile />} />
              <Route path="/trademain" element={<MarketSection />} />
              <Route path="/copytrade" element={<CopyTradingMobile />} />
              <Route path="/copy-positions" element={<CopyTradingPositions />} />
              <Route path="/mining" element={<MiningMobile />} />
              <Route path="/support" element={<SupportMobile />} />
              <Route path="/opensupport" element={<OpenSupportMobile />} />
              <Route path="/notification" element={<NotificationMobile />} />
              <Route path="/deposite" element={<DepositeStageMobile />} />
              <Route path="/withdraw" element={<WithdrawPage />} />
              <Route path="/transactionhistory" element={<TransactionHistoryMobile />} />
              <Route path="/accountupgrade" element={<AccountUpgradeMobile />} />
              <Route path="/referrals" element={<AccountReferralMobile />} />
              <Route path="/signal-packages" element={<SignalPackage1 />} />

            </Routes>
          </section>
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
            <Route index element={<HomeDashboardDesktop />} />
            <Route path="/payment" element={<PaymentSystem />} />
            <Route path="/signal-payment" element={<PaymentSystemSignal />} />
            <Route path="settings" element={<SettingsProfileDesktop />} />
            <Route path="trade" element={<TradeUIDesktop />} />
            <Route path="/trademain" element={<MarketSectionDesktop />} />
            <Route path="support" element={<SupportDesktop />} />
            <Route path="opensupport" element={<OpenSupportDesktop />} />
            <Route path="notification" element={<NotificationDesktop />} />
            <Route path="deposite" element={<DepositeStageDesktop />} />
            <Route path="withdraw" element={<WithdrawDesktop />} />
            <Route path="transactionhistory" element={<TransactionHistoryDesktop />} />
            <Route path="accountupgrade" element={<AccountUpgradeDesktop />} />
            <Route path="referrals" element={<AccountReferralDesktop />} />
            <Route path="referrals" element={<AccountReferralDesktop />} /> 
            <Route path="/copytrade" element={<CopyTradingDesktop />} />
            <Route path="copy-positions" element={<CopyTradingPositionsDesktop />} />
            <Route path="/mining" element={<MiningDesktop />} /> 
            <Route path="signal-packages" element={<SignalPackage1 />} />

              
          </Route>
        </Routes>
        </>
      )}
    </SidebarProvider>
  );
}

function App() {
  return (
    <UserAuthProvider>
      <BalanceProvider>
      <AppContent />
      </BalanceProvider>
    </UserAuthProvider>
  );
}

export default App;