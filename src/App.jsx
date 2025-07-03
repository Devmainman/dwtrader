import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from './context/UserAuthContext';

// Mobile Components
import HomeDashboardMobile from "./components/home/HomeDashboard";
import SettingsProfileMobile from "./components/profile/SettingsProfile";
import TopNavBarMobile from "./components/navigation/TopNavBar";
import TradeUIMobile from "./components/trade/TradeUI";
import SupportMobile from "./components/support/Support";
import OpenSupportMobile from "./components/support/OpenSupport";
import SideBarMobile from "./components/sidebar/SideBar";
import NotificationMobile from "./components/notification/index";
import DepositeStageMobile from "./components/Deposite/payment/PaymentSystem";
import WithdrawPage from "./components/withdrawal/withdrawalsystem/WithdrawalSystem";
import TransactionHistoryMobile from "./components/transactionhistory/TransactionHistoryScreen";
import AccountUpgradeMobile from "./components/accountupgrade/AccountUpgrade1";
import AccountReferralMobile from "./components/referrals/AccountReferral1";

// Desktop Components
import HomeDashboardDesktop from "./desktopcomponents/home/HomeDashboard1";
import SettingsProfileDesktop from "./desktopcomponents/profile/ProfileInformation";
import TradeUIDesktop from "./desktopcomponents/trade/TradingActivities";
import SupportDesktop from "./desktopcomponents/support/SupportTicket";
import DepositeStageDesktop from "./desktopcomponents/Deposite/PaymentMethod";
import WithdrawDesktop from "./desktopcomponents/withdraw/SelectWithdrawalMethod";
import NotificationDesktop from "./desktopcomponents/notification/Notification";
import TransactionHistoryDesktop from "./desktopcomponents/transactionhistory/TransactionHistory";
import AccountUpgradeDesktop from "./desktopcomponents/upgradeaccount/UpgradeAccount";
import AccountReferralDesktop from "./desktopcomponents/referrals/Referrals";
import OpenSupportDesktop from "./desktopcomponents/support/OpenSupportDesktop";

// Layouts
import DesktopLayout from "./desktopcomponents/DesktopLayout";
import { SidebarProvider } from "./context/SidebarContext";
import { UserAuthProvider } from './context/UserAuthContext';
import { BalanceProvider } from './context/BalanceContext';
import UserPopupHandler from './components/UserPopupHandler';
import Navbar from "./Navbar";
import VerificationStatusModal from './components/VerificationStatusModal';
import BlockedNoticeModal from './components/BlockedNoticeModal';


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

  const location = useLocation();
  const { user, loading, error, token, loggingOut } = useUserAuth();
  

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

  // 3. Show error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-red-500">
        Error: {error}
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
      {isMobile ? (
        <>
          <VerificationStatusModal
            show={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            emailRequested={verificationStatus.emailRequested}
            phoneRequested={verificationStatus.phoneRequested}
          />
          <UserPopupHandler />
          <Navbar />
          <SideBarMobile />
          <TopNavBarMobile />
          <section className="flex flex-col overflow-y-auto min-h-screen bg-neutral-900">
            <Routes>
              <Route path="/" element={<HomeDashboardMobile />} />
              <Route path="/settings" element={<SettingsProfileMobile />} />
              <Route path="/trade" element={<TradeUIMobile />} />
              <Route path="/support" element={<SupportMobile />} />
              <Route path="/opensupport" element={<OpenSupportMobile />} />
              <Route path="/notification" element={<NotificationMobile />} />
              <Route path="/deposite" element={<DepositeStageMobile />} />
              <Route path="/withdraw" element={<WithdrawPage />} />
              <Route path="/transactionhistory" element={<TransactionHistoryMobile />} />
              <Route path="/accountupgrade" element={<AccountUpgradeMobile />} />
              <Route path="/referrals" element={<AccountReferralMobile />} />
            </Routes>
          </section>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<DesktopLayout />}>
            {/* <Route index element={<HomeDashboardDesktop />} />
            <Route path="settings" element={<SettingsProfileDesktop />} />
            <Route path="trade" element={<TradeUIDesktop />} />
            <Route path="support" element={<SupportDesktop />} />
            <Route path="opensupport" element={<OpenSupportDesktop />} />
            <Route path="notification" element={<NotificationDesktop />} />
            <Route path="deposite" element={<DepositeStageDesktop />} />
            <Route path="withdraw" element={<WithdrawDesktop />} />
            <Route path="transactionhistory" element={<TransactionHistoryDesktop />} />
            <Route path="accountupgrade" element={<AccountUpgradeDesktop />} />
            <Route path="referrals" element={<AccountReferralDesktop />} /> */}
          </Route>
        </Routes>
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