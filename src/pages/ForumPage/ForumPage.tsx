import { Layout } from '../../components/Layout';
import { FormLayout } from './layout';
import { Topic } from './components/topic';

import styles from './ForumPage.scss';

import dataForum from './data'

export const ForumPage = (): JSX.Element => {


    return (
        <Layout>
            <FormLayout>
                <div className={styles.field}>
                    {dataForum.map(item => (
                        <Topic theme={item.theme} date={item.date}  description={item.description} name={item.name} comments={item.comments}/>
                    ))}
                </div>
            </FormLayout>
        </Layout>
    );
};