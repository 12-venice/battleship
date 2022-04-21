import cn from 'classnames';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from 'src/context/Authcontext';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { Layout } from '../../components/Layout';
import { Topic } from './components/topic';
import { AddTopicWindow } from './components/addTopic';
import styles from './ForumPage.scss';
import { DeleteTopicWindow } from './components/deleteTopic';
import { EditTopicWindow } from './components/editTopic';

export const ForumPage = (): JSX.Element => {
    const { user } = useContext(AuthContext);
    const [topicId, setTopicId] = useState('');
    const [topicTheme, setTopicTheme] = useState('');
    const [topicDesc, setTopicDesc] = useState('');
    const [openCreateWindow, setWindowCreate] = useState(false);
    const [openDeleteWindow, setWindowDelete] = useState(false);
    const [editDeleteWindow, setWindowEdit] = useState(false);
    const [textComment, setTextComment] = useState('');
    const [topics, setTopics] = useState([]);
    const { request, loading } = useHttp();

    const getTopics = useCallback(async () => {
        const data = await request('/api/topic/read', 'POST', null, {}, true);
        setTopics(data);
    }, [request]);

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
                    key={uuidv4()}
                    theme={item.theme}
                    date={DateParser(item.date)}
                    description={item.description}
                    name={item.user?.display_name || ''}
                    comments={item.comments}
                    setTopicId={setTopicId}
                    id={item._id}
                    deleteFunc={(_id) => {
                        setTopicId(_id);
                        setWindowDelete(true);
                    }}
                    editFunc={(_id, theme, description) => {
                        setTopicTheme(theme);
                        setTopicId(_id);
                        setTopicDesc(description);
                        setWindowEdit(true);
                    }}
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
                        title="✚"
                        onClick={() => setWindowCreate(true)}
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
                        className={cn(styles.forum__input, 'browser-default')}
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
            {openCreateWindow && user && (
                <AddTopicWindow
                    close={() => {
                        setWindowCreate(false);
                        getTopics();
                    }}
                />
            )}
            {openDeleteWindow && (
                <DeleteTopicWindow
                    close={() => {
                        setWindowDelete(false);
                        getTopics();
                    }}
                    _id={topicId}
                />
            )}
            {editDeleteWindow && (
                <EditTopicWindow
                    close={() => {
                        setWindowEdit(false);
                        getTopics();
                    }}
                    _id={topicId}
                    oldTheme={topicTheme}
                    oldDescription={topicDesc}
                />
            )}
        </Layout>
    );
};
