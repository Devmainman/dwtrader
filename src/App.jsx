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

// Auth Pages
import LoginPage from "./desktopcomponents/authpages/loginpage/LoginScreen";
import SignupPage from "./desktopcomponents/authpages/signup/SignUpForm";
import WelcomePage from "./desktopcomponents/authpages/welcome/InputDesign";

function AppContent() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const { user, loading, error, token } = useUserAuth(); // Added token to destructuring

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define auth routes
  const isAuthRoute = ['/auth', '/signup', '/welcome'].includes(location.pathname);
  const isSignupRoute = location.pathname === '/signup';
  const isWelcomeRoute = location.pathname === '/welcome';

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-red-500">
      Error: {error}
    </div>;
  }

  // Handle authentication state
  if (!token && !isAuthRoute) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (token && isAuthRoute && !isSignupRoute && !isWelcomeRoute) {
    return <Navigate to="/" replace />;
  }

  // Handle signup flow
  if (user) {
    // If user exists but hasn't completed verification and isn't on signup/welcome page
    if (!user.isVerified && !isSignupRoute && !isWelcomeRoute) {
      // return <Navigate to="/" replace />;
    }
    
    // If user is verified but tries to access signup/welcome
    if (user.isVerified && (isSignupRoute || isWelcomeRoute)) {
      // return <Navigate to="/" replace />;
    }
  }

  // Render auth routes if needed
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
      {isMobile ? (
        <>
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