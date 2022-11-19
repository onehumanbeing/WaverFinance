import React from 'react';
import styles from './index.module.scss';

export interface ISelectOption {
  key: string;
  value: string;
}

const Input: React.FC<{
  title?: string,
  className?: string,
  style?: React.CSSProperties,
  type?: 'text' | 'password' | 'email' | 'number' | 'select',
  options?: ISelectOption[],
  value?: string | number,
  onChange: (value: string) => void,
}> = ({
  title, className, style, type, options, value, onChange,
}) => {

  return (
    <div className={`${styles.input} ${className}`} style={style}>
      {title && (
        <div className={styles.input__title}>
          {title}
        </div>
      )}
      {
        type === 'select' ? (
          <select
            className={styles.input__element}
            title={title}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {options?.map(({ key, value }) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        ) : (
          <input
            className={styles.input__element}
            type={type}
            title={title}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      }
    </div>
  );
};

export default Input;
