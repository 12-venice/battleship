/* eslint-disable no-unused-expressions */
// Конфликт
/* eslint-disable prettier/prettier */
import cn from 'classnames';
import { MouseEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Layout } from '../../components/Layout';
import { leaders } from './data';

import styles from './LeaderPage.scss';

export const LeaderPage = (): JSX.Element => {
    const [sortType, setSortType] = useState('display_name');
    const [sortBtn, setSortBtn] = useState(false);
    leaders.sort(
        (a: {}, b: {}) => {
            if (sortBtn) {
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
            setSortBtn(!sortBtn);
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
                        <div
                            className={cn(
                                styles['leader__table-column-wide'],
                                sortType === 'display_name' && styles['leader__table-selected'],
                            )}
                            data-sort="display_name"
                            aria-hidden="true"
                            onClick={(event) => handlerClick(event)}
                        >
                            PLAYER
                        </div>
                        <div
                            className={cn(
                                styles['leader__table-column-standart'],
                                sortType === 'wins' && styles['leader__table-selected'],
                            )}
                            data-sort="wins"
                            aria-hidden="true"
                            onClick={(event) => handlerClick(event)}
                        >
                            <i className="medium material-icons">
                                {`arrow_drop_${sortBtn ? 'up' : 'down'}`}
                            </i>
                            WINS
                        </div>
                        <div
                            className={cn(
                                styles['leader__table-column-standart'],
                                sortType === 'defeats' && styles['leader__table-selected'],
                            )}
                            data-sort="defeats"
                            aria-hidden="true"
                            onClick={(event) => handlerClick(event)}
                        >
                            <i className="medium material-icons">
                                {`arrow_drop_${sortBtn ? 'up' : 'down'}`}
                            </i>
                            DEFEATS
                        </div>
                        <div
                            className={cn(
                                styles['leader__table-column-standart'],
                                sortType === 'points' && styles['leader__table-selected'],
                            )}
                            data-sort="points"
                            aria-hidden="true"
                            onClick={(event) => handlerClick(event)}
                        >
                            <i className="medium material-icons">
                                {`arrow_drop_${sortBtn ? 'up' : 'down'}`}
                            </i>
                            POINTS
                        </div>
                    </div>
                    <div className={styles['leader__table-block']}>
                        {leaders.map((element) => (
                            <div className={styles['leader__table-field']}>
                                <div
                                    className={cn(
                                        styles['leader__table-column-wide'],
                                        sortType === 'display_name' && styles['leader__table-selected'],
                                    )}
                                >
                                    {element.display_name}
                                </div>
                                <div
                                    className={cn(
                                        styles['leader__table-column-standart'],
                                        sortType === 'wins' && styles['leader__table-selected'],
                                    )}
                                >
                                    {element.wins}
                                </div>
                                <div
                                    className={cn(
                                        styles['leader__table-column-standart'],
                                        sortType === 'defeats' && styles['leader__table-selected'],
                                    )}
                                >
                                    {element.defeats}
                                </div>
                                <div
                                    className={cn(
                                        styles['leader__table-column-standart'],
                                        sortType === 'points' && styles['leader__table-selected'],
                                    )}
                                >
                                    {element.points}
                                </div>
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
