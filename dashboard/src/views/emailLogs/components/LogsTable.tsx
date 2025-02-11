import React from "react";
import CardMenu from "../../../components/card/CardMenu";
import Card from "../../../components/card";
import Progress from "../../../components/progress";
import { MdCancel, MdCheckCircle, MdOutlineError } from "react-icons/md";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

type RowObj = {
    id: string;
    to: string;
    created_at: string;
    status: string;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
interface LogsTableProps {
    data: RowObj[];
}

function LogsTable({ data }: LogsTableProps) {
    let navigate = useNavigate();

    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns = [
        columnHelper.accessor("id", {
            id: "id",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>
            ),
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("to", {
            id: "to",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">To</p>
            ),
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("created_at", {
            id: "created_at",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">DATE</p>
            ),
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {new Date(info.getValue()).toLocaleString()}
                </p>
            ),
        }),
        columnHelper.accessor("status", {
            id: "status",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">
                    STATUS
                </p>
            ),
            cell: (info) => (
                <div className="flex items-center">
                    {info.getValue() === "failed" ? (
                        <MdCheckCircle className="text-green-500 me-1 dark:text-green-300" />
                    ) : info.getValue() === "created" ? (
                        <MdCancel className="text-red-500 me-1 dark:text-red-300" />
                    ) : info.getValue() === "sent" ? (
                        <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300" />
                    ) : null}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                        {capitalizeFirstLetter(info.getValue())}
                    </p>
                </div>
            ),
        }),
        // columnHelper.accessor("progress", {
        //     id: "progress",
        //     header: () => (
        //         <p className="text-sm font-bold text-gray-600 dark:text-white">
        //             PROGRESS
        //         </p>
        //     ),
        //     cell: (info) => (
        //         <div className="flex items-center">
        //             <Progress width="w-[108px]" value={info.getValue()} />
        //         </div>
        //     ),
        // }),
    ]; // eslint-disable-next-line

    const rowSelectionHandler = (rowId: string) => {
        navigate(`/admin/logs/${rowId}`);
    }

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    return (
        <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
            <div className="overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="!border-px !border-gray-400">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                                    >
                                        <div className="items-center justify-between text-xs text-gray-200">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: "",
                                                desc: "",
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table
                        .getRowModel()
                        .rows.slice(0, 5)
                        .map((row) => {
                            return (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-200"
                                    onClick={() => rowSelectionHandler(row.getValue('id'))}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <td
                                                key={cell.id}
                                                className="min-w-[150px] border-white/0 py-3  pr-4"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default LogsTable;
