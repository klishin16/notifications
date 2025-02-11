import LogsTable from "./components/LogsTable";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../../constants";

function EmailsLogs() {
  const [logs, setLogs] = useState<
    Array<{ id: string; to: string; status: string; created_at: string }>
  >([]);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch(BASE_URL + "/api/email/logs/latest?limit=10");
      const data = await response
          .json()

      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="w-full">
      <LogsTable data={logs} />
    </div>
  );
}

export default EmailsLogs;
