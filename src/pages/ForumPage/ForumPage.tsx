import cn from 'classnames';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { DateParser } from 'src/components/utils/DateParse/DateParser';
import { AllStateTypes } from 'src/store/reducers';
import { lngService } from 'src/store/services/lngService';
import { useAuth } from 'src/hooks/auth.hook';
import { Layout } from '../../components/Layout';
import { Topic } from './components/topic';
import sendIcon from '../../../images/send.svg';
import plusIcon from '../../../images/plus.svg';
import { AddTopicWindow } from './components/addTopic';
import styles from './ForumPage.scss';
import { DeleteTopicWindow } from './components/deleteTopic';
import { EditTopicWindow } from './components/editTopic';
import { TopicProps } from './components/topic/types';

export const ForumPage = (): JSX.Element => {
    const { token } = useAuth();
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const [topicId, setTopicId] = useState('');
    const [commentId, setCommentId] = useState('');
    const [topicTheme, setTopicTheme] = useState('');
    const [topicDesc, setTopicDesc] = useState('');
    const [openCreateWindow, setWindowCreate] = useState(false);
    const [openDeleteWindow, setWindowDelete] = useState(false);
    const [editDeleteWindow, setWindowEdit] = useState(false);
    const [textComment, setTextComment] = useState('');
    const [topics, setTopics] = useState([]);
    const { request, loading } = useHttp();

    const getTopics = useCallback(async () => {
        const data = await request('/api/topic/read', 'GET', null);
        setTopics(data);
    }, [request]);

    const createComment = useCallback(async () => {
        const newTopic = {
            topic: topicId,
            comment: commentId,
            message: textComment,
        };
        await request('/api/comment/create', 'POST', newTopic, {
            Authorization: `Bearer ${token}`,
        });
        setTextComment('');
        getTopics();
    }, [commentId, getTopics, request, textComment, token, topicId]);

    useEffect(() => {
        getTopics();
    }, [getTopics]);

    const forumBlock = () => {
        if (loading) {
            return <Preloader />;
        }
        if (topics.length > 0) {
            return topics.map((topic: TopicProps) => (
                <Topic
                    key={topic._id}
                    theme={topic.theme}
                    createdAt={DateParser(topic.createdAt)}
                    message={topic.message}
                    user={topic.user}
                    isActiveTopic={topicId}
                    setTopicId={(_id) => setTopicId(_id)}
                    _id={topic._id}
                    deleteFunc={(_id) => {
                        setTopicId(_id);
                        setWindowDelete(true);
                    }}
                    editFunc={(_id, theme, message) => {
                        setTopicTheme(theme);
                        setTopicId(_id);
                        setTopicDesc(message);
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
                    <div>
                        <Button
                            skin="quad"
                            color="green"
                            disabled={!token}
                            onClick={() => setWindowCreate(true)}
                        >
                            <img
                                className={styles.icon}
                                src={plusIcon}
                                alt="Add"
                            />
                        </Button>
                        <Button
                            skin="quad"
                            onClick={() => lngService.changeLng()}
                            title={dataStore.buttons.change}
                        />
                    </div>
                    <div className={styles.forum__label}>
                        <p className={styles['forum__label-tag']}>BATTLESHIP</p>
                        <h2 className={styles['forum__label-description']}>
                            {dataStore.labels.forum}
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
                        placeholder={dataStore.text.forum}
                        value={textComment}
                        onChange={(e) => setTextComment(e.target.value)}
                    />
                    <Button
                        skin="quad"
                        // title={dataStore.buttons.send}
                        disabled={!topicId || !token}
                        onClick={createComment}
                    >
                        <img
                            className={styles.icon}
                            src={sendIcon}
                            alt="Send"
                        />
                    </Button>
                </div>
            </div>
            {openCreateWindow && (
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
