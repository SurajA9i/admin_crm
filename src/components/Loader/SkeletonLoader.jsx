import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = ({ rows, columns }) => {

    const skeletonColumns = Array(columns).fill(null);
    const skeletonRows = Array(rows).fill(null);
    return (
        <>
            {skeletonRows.map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {skeletonColumns.map((_, colIndex) => (
                        <td key={colIndex}>
                            <Skeleton width={100} height={20} />
                        </td>
                    ))}
                </tr>
            ))}
        </>

    );
};

export default SkeletonLoader;
