import styles from './index.module.scss';

const PageWidthWrapper: React.FC<{
  children: React.ReactNode,
  className?: string,
}> = ({ children, className }) => {
  return (
    <div className={`${styles.pageWidthWrapper} ${className ?? ''}`}>
      { children }
    </div>
  )
}

export default PageWidthWrapper;
