import { useState } from "react";
import { useNotification } from "../components/notifications/NotificationsProvider";

export function useFetchFactory() {
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(false);

  async function processFetch(input: RequestInfo | URL, init?: RequestInit) {
    setLoading(true);
    return fetch(input, init)
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          addNotification(
            response.statusText.replace("TypeError:", ""),
            "error"
          );
          return Promise.reject();
        } else {
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
          }

          return response.text();
        }
      })
      .catch((err) => {
        addNotification(err?.toString(), "error");

        return Promise.reject();
      })
      .finally(() => setLoading(false));
  }

  return { loading, processFetch };
}
