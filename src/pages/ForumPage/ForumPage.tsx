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
    const user = useSelector((state: AllStateTypes) => state.user.item);
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
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
            return topics.map((item: TopicProps) => (
                <Topic
                    key={item._id}
                    theme={item.theme}
                    date={DateParser(item.date)}
                    description={item.description}
                    user={item.user}
                    isActiveTopic={topicId}
                    setTopicId={setTopicId}
                    _id={item._id}
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
                    <div>
                        <Button
                            skin="quad"
                            color="green"
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
                        disabled={!topicId}
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
