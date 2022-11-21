import React from "react";
import Loading from "../Loading";

import styles from "./index.module.scss";

const Table: React.FC<{
  className?: string,
  columns: {
    title: string,
    dataIndex: string,
    key?: string,
    flexWidth?: number,
    render?: (text: any, record: any, index: number) => React.ReactNode,
  }[],
  loading?: boolean,
  emptyFallback?: React.ReactNode,
  dataSource: any[],
  rowKey?: string,
  onClickRow?: (record: any, index: number, key?: string) => void,
  // pagination?: {
  //   total: number,
  //   pageSize: number,
  //   current: number,
  //   onChange: (page: number, pageSize?: number) => void,
  // },
}> = ({ 
  className, columns, dataSource, rowKey, onClickRow, loading, emptyFallback
}) => {
  return (
    <>
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
            <tr className={`${styles.table__body__item} ${onClickRow && styles.clickable}`} key={rowKey ? data[rowKey] : index} onClick={() => {
              onClickRow?.(data, index, rowKey && data[rowKey]);
            }}>
              {columns.map((column, index) => (
                <td className={styles.table__body__item__cell} key={column.key ?? index}>
                  {column.render ? column.render(data[column.dataIndex], data, index) : data[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className={styles.table__loading}>
          <Loading />
        </div>
      )}
      {!dataSource?.length && !loading && (
        <div className={styles.table__empty}>
          {emptyFallback ?? (
            <div className={styles.table__empty__text}>
              No data
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Table;
