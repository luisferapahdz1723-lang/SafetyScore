/**
 * notificationService.ts — Polling de notificaciones contra el servidor MySQL local
 */

import { getNotifications } from './supabaseClient';

type NotificationCallback = (notification: {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'payment';
}) => void;

let pollingInterval: ReturnType<typeof setInterval> | null = null;
let lastSeenId: string | null = null;

export function subscribePymeNotifications(
  userId: string,
  _businessId: string,
  onNotification: NotificationCallback
): void {
  subscribeNotifications(userId, onNotification);
}

export function subscribeInvestorNotifications(
  userId: string,
  onNotification: NotificationCallback
): void {
  subscribeNotifications(userId, onNotification);
}

function subscribeNotifications(userId: string, onNotification: NotificationCallback): void {
  unsubscribe();
  pollingInterval = setInterval(async () => {
    try {
      const notifications = await getNotifications(userId);
      if (!notifications.length) return;
      const latest = notifications[0];
      if (latest.id !== lastSeenId) {
        lastSeenId = latest.id;
        onNotification({ title: latest.title, message: latest.message, type: latest.type });
      }
    } catch {
      // silencioso en background
    }
  }, 15000);
}

export function unsubscribe(): void {
  if (pollingInterval !== null) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

export function isSubscribed(): boolean {
  return pollingInterval !== null;
}
