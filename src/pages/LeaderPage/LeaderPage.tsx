/* eslint-disable no-unused-expressions */
// Конфликт
/* eslint-disable prettier/prettier */
import cn from 'classnames';
import { MouseEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Layout } from '../../components/Layout';
import { config } from './config';
import { leaders } from './data';

import styles from './LeaderPage.scss';

export const LeaderPage = (): JSX.Element => {
    const [sortType, setSortType] = useState('display_name');
    const [sortDirection, setSortDirection] = useState(false);
    leaders.sort(
        (a: {}, b: {}) => {
            if (sortDirection) {
                return b[sortType as keyof typeof b] - a[sortType as keyof typeof a];
            }
            return a[sortType as keyof typeof a] - b[sortType as keyof typeof b];
        },
    );

    const handlerClick = (
        event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    ): void => {
        const sortName = (event.target as HTMLDivElement).getAttribute('data-sort');
        if (sortName === sortType) {
            setSortDirection(!sortDirection);
        }
        setSortType(sortName || '');
    };

    return (
        <Layout>
            <div className={styles.leader__background}>
                <div className={styles.leader__header}>
                    <div />
                    <div className={styles.leader__label}>
                        <p className={styles['leader__label-tag']}>
                            BATTLESHIP
                        </p>
                        <h2 className={styles['leader__label-description']}>
                            LEADERBOARD
                        </h2>
                    </div>
                    <NavLink to={PageLinks.home}>
                        <Button skin="quad" title="X" />
                    </NavLink>
                </div>
                <div className={styles.leader__table}>
                    <div className={styles['leader__table-header']}>
                        {config.map((element, index) => (
                            <div
                                className={cn(
                                    styles[`leader__table-column-${index === 0 ? 'wide' : 'standart'}`],
                                    sortType === element.type && styles['leader__table-selected'],
                                )}
                                data-sort={element.type}
                                aria-hidden="true"
                                onClick={(event) => handlerClick(event)}
                            >
                                {index > 0 && (
                                    <i className="medium material-icons">
                                        {`arrow_drop_${sortDirection ? 'up' : 'down'}`}
                                    </i>
                                )}
                                {element.title}
                            </div>
                        ))}
                    </div>
                    <div className={styles['leader__table-block']}>
                        {leaders.map((element) => (
                            <div className={styles['leader__table-field']}>
                                {config.map((elementConfig, index) => (
                                    <div
                                        className={cn(
                                            styles[`leader__table-column-${index === 0 ? 'wide' : 'standart'}`],
                                            sortType === elementConfig.type && styles['leader__table-selected'],
                                        )}
                                    >
                                        {element[elementConfig.type as keyof typeof element]}
                                    </div>
                                ))}
                            </div>
                        ))}
                        {leaders.length < 5 && (
                            <div
                                className={styles['leader__table-block-empty']}
                            />
                        )}
                        <div />
                    </div>
                    <div className={styles.leader__footer} />
                </div>
            </div>
        </Layout>
    );
};
