import { useTranslation } from "next-i18next";
import { Stack } from "../Stack";
import cls from './Table.module.scss';
import { BsArrowDown, BsArrowDownUp, BsArrowUp, BsInboxFill } from "react-icons/bs";
import type { ReactNode } from "react";
import React from 'react';

interface TableColumn {
    key: string;
    title: string;
    sort?: boolean;
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
        const { t } = useTranslation('common');

        const [sortPriority, setSortPriority] = React.useState<{ key: string, mode: 'ascending' | 'descending'} | undefined>(undefined)

        const data = React.useMemo(() => {
            const data = rows.map((row, index) => ({...row, index}))
            if (sortPriority) {
                data.sort((a, b) => {
                    const aData = a.data[sortPriority.key]
                    const bData = b.data[sortPriority.key]
                    let result = 0;
                    if (typeof aData === 'string' && typeof bData === 'string') {
                        result = aData.localeCompare(bData)
                    } else if (typeof aData === 'number' && typeof bData === 'number') {
                        result = aData - bData
                    }
                    if(result === 0) {
                      result = a.index - b.index
                    }
                    return sortPriority.mode == 'ascending' ? result : -result
                })
            }
            return data
        }, [rows, sortPriority])

        return (
            <div className={cls.root} >
                <div className={cls.wrapper}>
                    <table ref={ref}>
                        {header ? (
                            <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key} onClick={() => {
                                        if(!column.sort) {
                                            return ;
                                        }
                                        if(sortPriority === undefined) {
                                            setSortPriority({key: column.key, mode: 'ascending'})
                                            return ;
                                        }
                                        if(sortPriority.key == column.key) {
                                            setSortPriority({key: column.key, mode: sortPriority.mode == 'ascending' ? 'descending' : 'ascending'})
                                        } else {
                                            setSortPriority({key: column.key, mode: 'ascending'})
                                        }
                                        }}>
                                            {column.title}
                                            &nbsp;
                                            {column.sort && (
                                                sortPriority?.key === column.key ? (
                                                sortPriority?.mode === 'ascending' ?
                                                (<BsArrowUp size={12} />) :
                                                (<BsArrowDown size={12}  />)
                                                ) : (<BsArrowDownUp size={12}  />
                                                )
                                            )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        ) : null}
                        <tbody>
                        {data.map((row, index) => (
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
                            <span className={cls.text}>{t('Пусто')}</span>
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