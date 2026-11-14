// Kept for existing components: reads the shared, live notification store.
import { useNotificationStore } from '../context/NotificationContext';

export const useNotifications = () => useNotificationStore();
