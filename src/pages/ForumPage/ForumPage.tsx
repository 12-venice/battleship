import { NavLink } from 'react-router-dom';

import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Layout } from '../../components/Layout';
import { Topic } from './components/topic';

import styles from './ForumPage.scss';

import { dataForum } from './data';

export const ForumPage = (): JSX.Element => (
    <Layout>
        <div className={styles.forum__background}>
            <div className={styles.forum__header}>
                <div className={styles.forum__label}>
                    <p className={styles['forum__label-tag']}>BATTLESHIP</p>
                    <h2 className={styles['forum__label-description']}>
                        FORUM
                    </h2>
                </div>
                <NavLink to={PageLinks.home}>
                    <Button className={styles.forum__btn} title="x" />
                </NavLink>
            </div>
            <div className={styles.forum__main}>
                <div className={styles['forum__main-field']}>
                    {dataForum.map((item) => (
                        <Topic
                            theme={item.theme}
                            date={item.date}
                            description={item.description}
                            name={item.name}
                            comments={item.comments}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.forum__footer}>
                <input
                    className={styles.forum__input}
                    type="text"
                    placeholder="Send comment..."
                />
                <Button className={styles.forum__btn} title="send" />
            </div>
        </div>
    </Layout>
);