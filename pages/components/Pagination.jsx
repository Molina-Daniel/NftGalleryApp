import classnames from 'classnames';
import { usePagination, DOTS } from '../customHooks/usePagination';
import styles from './Pagination.module.css';

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames(`${styles.paginationContainer}`, { [className]: className })}
    >

      {/* Left navigation arrow */}
      <li
        key="previous"
        className={classnames(`${styles.paginationItem}`, {
        disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className={`${styles.arrow} ${styles.left}`} />
      </li>

      {paginationRange.map(pageNumber => {

        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return <li className={`${styles.paginationItem} ${styles.dots}`}>&#8230;</li>;
        }

        // Render our Page Pills
        return (
          <li
            key={pageNumber}
            className={classnames(`${styles.paginationItem}`, {
            selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}

      {/*  Right Navigation arrow */}
      <li
        key="next"
        className={classnames(`${styles.paginationItem}`, {
        disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className={`${styles.arrow} ${styles.right}`} />
      </li>
    </ul>
  );
};

export default Pagination;
