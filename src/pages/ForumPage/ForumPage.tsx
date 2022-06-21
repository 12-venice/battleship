import { useSelector } from 'react-redux';
import { Button } from 'src/components/Button';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useHttp } from 'src/hooks/http.hook';
import { useCallback, useEffect, useState } from 'react';
import { Preloader } from 'src/components/Preloader';
import { AllStateTypes } from 'src/store/reducers';
import { lngService } from 'src/store/services/lngService';
import { useAuth } from 'src/hooks/auth.hook';
import { Icon } from 'src/components/Icon/Icon';
import { InputMessage } from 'src/components/InputMessage';
import { Layout } from '../../components/Layout';
import { Topic } from './components/topic';
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
    const [topicTheme, setTopicTheme] = useState('');
    const [topicDescription, setTopicDescription] = useState('');
    const [openCreateWindow, setWindowCreate] = useState(false);
    const [openDeleteWindow, setWindowDelete] = useState(false);
    const [openEditWindow, setWindowEdit] = useState(false);
    const [topics, setTopics] = useState([]);
    const { request, loading } = useHttp();

    const getTopics = useCallback(async () => {
        const data = await request('/api/topic/read', 'GET', null);
        setTopics(data);
    }, [request]);

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
                    _id={topic._id}
                    theme={topic.theme}
                    description={topic.description}
                    user={topic.user}
                    createdAt={topic.createdAt}
                    deleteFunc={() => {
                        setWindowDelete(!openDeleteWindow);
                    }}
                    editFunc={() => {
                        setWindowEdit(!openEditWindow);
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
                    <div className={styles['forum__header-left']}>
                        <Button
                            skin="quad"
                            color="green"
                            disabled={!token}
                            onClick={() => setWindowCreate(!openCreateWindow)}
                        >
                            <Icon type="plus" />
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
                    <InputMessage />
                </div>
            </div>
            {openCreateWindow && (
                <AddTopicWindow
                    close={() => {
                        setWindowCreate(!openCreateWindow);
                        getTopics();
                    }}
                />
            )}
            {openDeleteWindow && (
                <DeleteTopicWindow
                    close={() => {
                        setWindowDelete(!openDeleteWindow);
                        getTopics();
                    }}
                />
            )}
            {openEditWindow && (
                <EditTopicWindow
                    close={() => {
                        setWindowEdit(!openEditWindow);
                        getTopics();
                    }}
                />
            )}
        </Layout>
    );
};
