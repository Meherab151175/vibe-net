import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

interface NotificationsButtonProps {
    initialState: NotificationCountInfo;
  }
  
  export default function NotificationsButton({
    initialState,
  }: NotificationsButtonProps) {
    const { data } = useQuery({
      queryKey: ["unread-notification-count"],
      queryFn: () =>
        kyInstance
          .get("/api/notifications/unread-count")
          .json<NotificationCountInfo>(),
      initialData: initialState,
      refetchInterval: 60 * 1000,
    });
  