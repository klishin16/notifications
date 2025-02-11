import React, { useEffect } from 'react';
import Notification from './Notification';
import { useNotification } from './NotificationsProvider';

const NotificationsContainer = () => {
    const { notifications, removeNotification } = useNotification();

    useEffect(() => {
        console.log('notifications:', notifications);
    }, [notifications])

    return (
        <>
            {notifications.map((notification: any) => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </>
    );
};

export default NotificationsContainer;
