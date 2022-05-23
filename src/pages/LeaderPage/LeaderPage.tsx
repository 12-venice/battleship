import cn from 'classnames';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { lngService } from 'src/store/services/lngService';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from '../../components/Layout';
import { config } from './config';

import styles from './LeaderPage.scss';

export const LeaderPage = (): JSX.Element => {
    const dataStore = useSelector((state: AllStateTypes) => state.language);
    const { request } = useHttp();
    const [leaders, setLeaders] = useState([]);
    const [sortType, setSortType] = useState('display_name');
    const [sortDirection, setSortDirection] = useState(false);
    const [page, setPage] = useState(0);
    const getLeaders = useCallback(async () => {
        const users = await request(
            '/api/user/read',
            'POST',
            {
                sortType,
                sortDirection,
                page,
            },
            {},
            true,
        );
        setLeaders(users);
    }, [page, request, sortDirection, sortType]);

    useEffect(() => {
        getLeaders();
    }, [getLeaders]);

    const handlerClick = (
        event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    ): void => {
        const sortName = (event.target as HTMLDivElement).getAttribute(
            'data-sort',
        );
        if (sortName === sortType) {
            setSortDirection(!sortDirection);
        }
        setSortType(sortName || '');
    };

    const handlerPage = (p: number) => {
        setPage(page + p);
        getLeaders();
    };

    return (
        <Layout>
            <div className={styles.leader__background}>
                <div className={styles.leader__header}>
                    <Button
                        skin="quad"
                        onClick={() => lngService.changeLng()}
                        title={dataStore.translate.buttons.change}
                    />
                    <div className={styles.leader__label}>
                        <p className={styles['leader__label-tag']}>
                            BATTLESHIP
                        </p>
                        <h2 className={styles['leader__label-description']}>
                            {dataStore.translate.labels.leaders}
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
                                key={uuidv4()}
                                className={cn(
                                    styles[
                                        `leader__table-column-${
                                            index === 0 ? 'wide' : 'standart'
                                        }`
                                    ],
                                    sortType === element.type &&
                                        styles['leader__table-selected'],
                                )}
                                data-sort={element.type}
                                aria-hidden="true"
                                onClick={(event) => handlerClick(event)}
                            >
                                {index > 0 && (
                                    <i
                                        className={cn(
                                            styles.test1,
                                            'material-icons',
                                        )}
                                    >
                                        {`arrow_drop_${
                                            sortDirection ? 'up' : 'down'
                                        }`}
                                    </i>
                                )}
                                <p
                                    className={
                                        styles['leader__table-column_text']
                                    }
                                >
                                    {dataStore.language === 'ru'
                                        ? element.titleRU
                                        : element.titleEN}
                                </p>
                                <p
                                    className={
                                        styles['leader__table-column_short']
                                    }
                                >
                                    {dataStore.language === 'ru'
                                        ? element.titleRU.charAt(0)
                                        : element.titleEN.charAt(0)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className={styles['leader__table-block']}>
                        {leaders.map((element: User) => (
                            <div
                                key={element.id}
                                className={styles['leader__table-field']}
                            >
                                {config.map((elementConfig, index) => (
                                    <div
                                        key={elementConfig.type}
                                        className={cn(
                                            styles[
                                                `leader__table-column-${
                                                    index === 0
                                                        ? 'wide'
                                                        : 'standart'
                                                }`
                                            ],
                                            sortType === elementConfig.type &&
                                                styles[
                                                    'leader__table-selected'
                                                ],
                                        )}
                                    >
                                        {
                                            element[
                                                elementConfig.type as keyof typeof element
                                            ]
                                        }
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
                    <div className={styles.leader__footer}>
                        {page > 0 && (
                            <span aria-hidden onClick={() => handlerPage(-1)}>
                                prev
                            </span>
                        )}
                        {leaders.length === 10 && (
                            <span aria-hidden onClick={() => handlerPage(1)}>
                                prev
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
