import { Stack } from "../Stack";
import cls from './Table.module.scss';
import { BsInboxFill } from "react-icons/bs";
import type { ReactNode } from "react";
import React from 'react';

interface TableColumn {
    key: string;
    title: string;
}

// interface Clickable {
//     onClick?: (index: number) => void;
// }
interface TableRow {
    onClick?: (index: number) => void;
    data: Record<string, ReactNode>;
}

interface TableProps {
    columns: TableColumn[];
    rows: TableRow[];
    footer?: ReactNode;
    header?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ columns, rows, footer, header = true }, ref) => {
        return (
            <div className={cls.root} >
                <div className={cls.wrapper}>
                    <table ref={ref}>
                        {header ? (
                            <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key}>
                                        {column.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        ) : null}
                        <tbody>
                        {rows.map((row, index) => (
                                <tr data-clickable={Boolean(row.onClick)} onClick={() => row.onClick?.(index)} key={index}>
                                    {columns.map((column) => (
                                        <td key={column.key}>{row.data[column.key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {rows.length === 0 ? (
                        <Stack
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            gap={8}
                            className={cls.empty}
                        >
                            <BsInboxFill width={24} />
                            <span className={cls.text}>{'Пусто'}</span>
                        </Stack>
                    ) : null}
                    {
                        footer ? (
                            <footer>
                                {footer}
                            </footer>
                        ) : null
                    }
                </div>
            </div>
        )
    }
)

Table.displayName = 'Table';