import { PushNotifications, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import axios from 'axios';

const NotificationService = {

    initialize: () => {

        PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                PushNotifications.register();
            } else {
                console.warn('Push notifications permission not granted.');
            }
        });

        PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Error on registration: ', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
            console.log('Received a notification: ', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
            console.log('Performed action on a notification: ', notification);
        });
    },

    sendNotification: async (title: string, message: string) => {
        try {
            const notificationPayload = {
                title: title,
                body: message,
            };

            axios.post('/sendNotification', { ...notificationPayload });
        } catch (error) {
            console.error("Error sending notification:", error);
            throw error;
        }
    },
};

export default NotificationService;