import React from "react";

import styles from "./index.module.scss";

const Table: React.FC<{
  className?: string,
  columns: {
    title: string,
    dataIndex: string,
    key?: string,
    flexWidth?: number,
    render?: (text: string, record: any, index: number) => React.ReactNode,
  }[],
  dataSource: any[],
  rowKey?: string,
  // pagination?: {
  //   total: number,
  //   pageSize: number,
  //   current: number,
  //   onChange: (page: number, pageSize?: number) => void,
  // },
}> = ({ 
  className, columns, dataSource, rowKey 
}) => {
  return (
    <table className={`${styles.table} ${className ?? ""}`}>
      <thead>
        <tr className={styles.table__header}>
          {columns.map((column, index) => (
            <th className={styles.table__header__item} key={column.key ?? index}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((data, index) => (
          <tr className={styles.table__body__item} key={rowKey ? data[rowKey] : index}>
            {columns.map((column, index) => (
              <td className={styles.table__body__item__column} key={index}>
                {column.render ? column.render(data[column.dataIndex], data, index) : data[column.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table;
