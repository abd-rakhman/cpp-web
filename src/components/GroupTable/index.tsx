import { useTranslation } from "next-i18next";
import { Stack } from "../Stack";
import cls from './GroupTable.module.scss';
import { BsChevronDown, BsChevronRight, BsInboxFill } from "react-icons/bs";
import { Text } from "../Typography";
import type { ReactNode } from "react";
import React from 'react';
import clsx from "clsx";

interface GroupTableColumn {
    key: string;
    title: string;
}

// interface Clickable {
//     onClick?: (index: number) => void;
// }

interface GroupTableRow {
    onClick?: (index: number) => void;
    data: Record<string, ReactNode>;
}

interface Group {
  text: string;
  expanded: boolean;
  rows: GroupTableRow[];
}

interface GroupTableProps {
    columns: GroupTableColumn[];
    groups: Group[];
    footer?: ReactNode;
    header?: boolean;
}

export const GroupTable = React.forwardRef<HTMLTableElement, GroupTableProps>(
    ({ columns, groups, footer, header = true }, ref) => {
        const { t } = useTranslation('common');
        const [hiddenMap, setHiddenMap] = React.useState<Record<string, boolean>>({});

        const changeHidden = (key: string) => {
            const newHiddenMap = {...hiddenMap};
            newHiddenMap[key] = !newHiddenMap[key];
            setHiddenMap(newHiddenMap);
        }

        return (
            <div className={cls.root} >
                <div className={cls.wrapper}>
                    <table ref={ref}>
                        {header ? (
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.key}>{column.title}</th>
                                    ))}
                                </tr>
                            </thead>
                        ) : null}
                        <tbody>
                            {
                              groups.map((group, index) => {
                                return (
                                  <React.Fragment key={'group' + index}>
                                    <tr onClick={() => changeHidden(group.text)} className={clsx(cls.groupRow, (hiddenMap[group.text] === true && cls.closedRow))}>
                                        <td colSpan={columns.length}>
                                            <Stack gap={8} alignItems="center">
                                                {hiddenMap[group.text] !== true ? <BsChevronDown /> : <BsChevronRight />}
                                                <Text bold>{group.text.slice(0, 10) + " " + (group.text.at(group.text.length - 1) === 'd' ? t('day-shift') : t('night-shift'))}</Text>
                                            </Stack>
                                        </td>
                                    </tr>
                                    {hiddenMap[group.text] !== true && group.rows.map((row, index) => (
                                        <tr data-clickable={Boolean(row.onClick)} onClick={() => row.onClick?.(index)} key={index}>
                                            {columns.map((column) => (
                                                <td key={column.key}>{row.data[column.key]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                  </React.Fragment>
                                )
                              })
                            }
                        </tbody>
                    </table>
                    {groups.length === 0 ? (
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

GroupTable.displayName = 'GroupTable';