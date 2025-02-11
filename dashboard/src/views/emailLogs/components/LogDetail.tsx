import Card from "../../../components/card";
import React, { useEffect } from "react";
import { useFetchFactory } from "../../../utils/useFetchFactory";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../constants";

function LogDetail() {
  const { id } = useParams();
  const { processFetch: fetchTemplate } = useFetchFactory();

  const [preview, setPreview] = React.useState("");

  useEffect(() => {
    fetchTemplate(BASE_URL + `/api/email/${id}/preview`)
      .then((html) => setPreview(html))
      .catch(() => {});
  }, []);

  return (
    <Card extra={"w-full p-4 h-full"}>
      <h4 className="text-xl font-bold text-navy-700 dark:text-white">
        Предпросмотр письма
      </h4>
      <div
        className="text-black h-80 overflow-auto rounded-lg border bg-white p-2"
        dangerouslySetInnerHTML={{ __html: preview }}
      />
    </Card>
  );
}

export default LogDetail;
