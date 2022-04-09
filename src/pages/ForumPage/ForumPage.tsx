import { Layout } from '../../components/Layout';
import { FormLayout } from './layout';
import { Topic } from './components/topic';
import { Comment } from './components/comment';

import styles from './ForumPage.scss';

export const ForumPage = (): JSX.Element => {
    const dsc = `
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Ullam nam inventore fugit suscipit! Quas ratione expedita
        nobis accusantium esse nostrum vero quaerat error at? Molestiae,
        dolores. Sequi, molestiae. Debitis, fugit.
    `;
    return (
        <Layout>
            <FormLayout>
                <div className={styles.field}>
                    <Topic name="Topic 23" date={'23/06/3456'} theme={''} description={dsc} >
                        <Comment name={'Ivan299392939239'} date={'23/05/2004'} description={dsc + dsc + dsc}/>
                        <Comment name={'Ivan'} date={'23/05/2004'} description={dsc}/>
                        <Comment name={'Ivan'} date={'23/05/2004'} description={"Some text.."}/>
                        <Comment name={'Ivan'} date={'23/05/2004'} description={dsc + " Lorem lorem"}/>
                    </Topic>
                    <Topic name={''} date={'3/09/2001'} theme={''} >
                        <Comment name={'Ivan'} date={'23/05/2004'} description={dsc}/>
                    </Topic>
                    <Topic name="Topic 23" date={''} theme={''} >
                    </Topic>
                    <Topic name={''} date={'3/09/2001'} theme={''} >
                    </Topic>
                </div>
            </FormLayout>
        </Layout>
    );
};
