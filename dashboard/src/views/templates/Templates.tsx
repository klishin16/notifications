import React, { useEffect, useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import Card from "../../components/card";
import { useFetchFactory } from "../../utils/useFetchFactory";
import { BASE_URL } from "../../constants";

export default function Templates() {
  /** Custom hooks */
  const { processFetch: fetchTemplates } = useFetchFactory();
  const { processFetch: fetchTemplate } = useFetchFactory();
  const { processFetch: fetchUploadTemplate } = useFetchFactory();

  /** Refs */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** States */
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [preview, setPreview] = useState("");
  const [templates, setTemplates] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null); // Uploaded file

  /** Hooks */
  useEffect(() => {
    fetchTemplates(BASE_URL + "/api/templates")
      .then((data) => {
        setTemplates(data);
      })
      .catch((e) => console.error(e));
  }, []);

  /** Handlers */
  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);

    fetchTemplate(BASE_URL + `/api/templates/${template}`).then((html) =>
      setPreview(html)
    );
  };

  const handleUploadTemplate = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    fetchUploadTemplate(BASE_URL + "/api/templates", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        setFile(null);
        alert("Шаблон загружен!");
      })
      .catch((e) => {});
  };

  return (
    <div className="grid w-full grid-cols-2 gap-5">
      <Card extra={"w-full p-4 h-full"}>
        <div className="mb-2 w-full">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Все шаблоны
          </h4>
          <p className="mt-2 text-base text-gray-600">
            Список всех доступных для использования шаблонов
          </p>
        </div>

        {templates.map((template, index) => (
          <div
            className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:!bg-navy-700 dark:shadow-none dark:hover:!bg-navy-600 dark:active:!bg-navy-700"
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {template}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <Card extra={"w-full p-4 h-full"}>
        <div className="mb-2 w-full">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            {selectedTemplate
              ? `Предпросмотр шаблона ${selectedTemplate}`
              : "Выберите шаблон для предпросмотра"}
          </h4>
        </div>

        <div
          className="text-black h-80 overflow-auto rounded-lg border bg-white p-2"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </Card>

      <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-cyan-900 dark:shadow-none 2xl:grid-cols-11">
        <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
          <button
            className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 hover:border-gray-400 dark:!border-navy-700 hover:dark:!border-navy-600 lg:pb-0"
            onClick={() => fileInputRef.current.click()}
          >
            {file ? (
              <div className="text-xl dark:text-white">{file.name}</div>
            ) : (
              <>
                <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
                <h4 className="text-xl font-bold text-brand-500 dark:text-white">
                  Upload Files
                </h4>
                <p className="mt-2 text-sm font-medium text-gray-600">
                  HBS files are allowed
                </p>
              </>
            )}
          </button>
          <input
            onChange={(e) => setFile(e.target.files![0])}
            multiple={false}
            ref={fileInputRef}
            type="file"
            accept=".hbs"
            hidden
          />
        </div>

        <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pb-4 pl-3 dark:!bg-cyan-900">
          <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
            Добавить шаблон
          </h5>
          <p className="leading-1 mt-2 text-base font-normal text-gray-600">
            Загрузить новый шаблон на сервер
          </p>
          <button
            className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            onClick={handleUploadTemplate}
            disabled={!file}
          >
            Добавить
          </button>
        </div>
      </Card>
    </div>
  );
}

// <div className="flex w-full flex-col gap-5">
//     <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
//         <div className="col-span-4 lg:!mb-0">
//             <Banner />
//         </div>
//
//         <div className="col-span-3 lg:!mb-0">
//             <Storage />
//         </div>
//
//         <div className="z-0 col-span-5 lg:!mb-0">
//             <Upload />
//         </div>
//     </div>
//     {/* all project & ... */}
//
//     <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
//         <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
//             <Project />
//         </div>
//         <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
//             <General />
//         </div>
//
//         <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
//             <Notification />
//         </div>
//     </div>
// </div>

// <div className="p-6">
//     <h1 className="text-2xl font-bold mb-4">📄 Email Templates</h1>
//
//     <div className="grid grid-cols-2 gap-4">
//         <div className="p-4 border rounded-lg shadow">
//             <h2 className="text-lg font-semibold">📜 Доступные шаблоны</h2>
//             <ul className="mt-2">
//                 {templates.map(name => (
//                     <li key={name} className="cursor-pointer text-blue-600 hover:underline" onClick={() => loadTemplate(name)}>
//                         {name}
//                     </li>
//                 ))}
//             </ul>
//
//             <h2 className="text-lg font-semibold mt-4">📤 Загрузить новый шаблон</h2>
//             <input type="file" accept=".html" onChange={(e) => setFile(e.target.files![0])} />
//             <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={uploadTemplate}>
//                 Загрузить
//             </button>
//         </div>
//
//         <div className="p-4 border rounded-lg shadow">
//             <h2 className="text-lg font-semibold">👀 Предпросмотр шаблона</h2>
//             <div className="border p-2 h-80 overflow-auto bg-white text-black" dangerouslySetInnerHTML={{ __html: preview }} />
//         </div>
//     </div>
// </div>
