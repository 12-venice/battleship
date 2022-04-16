/* eslint-disable object-curly-newline */
// Не нравиться обозначени _id из монгодб
/* eslint-disable no-underscore-dangle */
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { AuthContext } from 'src/context/Authcontext';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { Layout } from '../../components/Layout';
import { Topic } from './components/topic';
import styles from './ForumPage.scss';

export const ForumPage = (): JSX.Element => {
    const { user } = useContext(AuthContext);
    const [topicId, setTopicId] = useState('');
    const [textComment, setTextComment] = useState('');
    const [topics, setTopics] = useState([
        {
            theme: '',
            date: new Date(),
            description: '',
            user: { display_name: '' },
            comments: [],
            _id: '',
        },
    ]);
    const { request, loading } = useHttp();

    const getTopics = useCallback(async () => {
        const data = await request('/api/topic/read', 'POST', null, {}, true);
        setTopics(data);
    }, [request]);

    const createTopic = useCallback(async () => {
        const newTopic = {
            theme: 'TEST THEME',
            description: 'Description...',
            ...user,
        };
        await request('/api/topic/create', 'POST', newTopic, {}, true);
        getTopics();
    }, [getTopics, request, user]);

    const createComment = useCallback(async () => {
        const newTopic = {
            topic: topicId,
            description: textComment,
            ...user,
        };
        await request('/api/comment/create', 'POST', newTopic, {}, true);
        setTextComment('');
        getTopics();
    }, [getTopics, request, textComment, topicId, user]);

    const deleteTopic = useCallback(
        async (_id) => {
            await request('/api/topic/delete', 'POST', { _id }, {}, true);
            getTopics();
        },
        [getTopics, request],
    );

    useEffect(() => {
        getTopics();
    }, [getTopics]);
    const forumBlock = () => {
        if (loading) {
            return <Preloader />;
        }
        if (topics.length > 0) {
            return topics.map((item) => (
                <Topic
                    theme={item.theme}
                    date={DateParser(item.date)}
                    description={item.description}
                    name={item.user?.display_name || ''}
                    comments={item.comments}
                    setTopicId={setTopicId}
                    _id={item._id}
                />
            ));
        }
        return <div />;
    };

    return (
        <Layout>
            <div className={styles.forum__background}>
                <div className={styles.forum__header}>
                    <Button
                        skin="quad"
                        color="green"
                        title="+"
                        onClick={() => createTopic()}
                    />
                    <div className={styles.forum__label}>
                        <p className={styles['forum__label-tag']}>BATTLESHIP</p>
                        <h2 className={styles['forum__label-description']}>
                            FORUM
                        </h2>
                    </div>
                    <Button skin="quad" title="X" href={PageLinks.home} />
                </div>
                <div className={styles.forum__main}>
                    <div className={styles['forum__main-field']}>
                        {forumBlock()}
                    </div>
                </div>
                <div className={styles.forum__footer}>
                    <input
                        className={styles.forum__input}
                        type="text"
                        placeholder="Send comment..."
                        value={textComment}
                        onChange={(e) => setTextComment(e.target.value)}
                    />
                    <Button
                        skin="short"
                        title="SEND"
                        disabled={!topicId}
                        onClick={createComment}
                    />
                </div>
            </div>
        </Layout>
    );
};
