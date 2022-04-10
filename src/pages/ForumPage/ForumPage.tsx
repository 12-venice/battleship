import { Layout } from '../../components/Layout';
import { FormLayout } from './layout';
import { Topic } from './components/topic';
import { Comment } from './components/comment';

import styles from './ForumPage.scss';

export const ForumPage = (): JSX.Element => {

    const dataForum = [
        {
            name: "Fedor",
            date: '02.04.22',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam nam inventore fugit suscipit!',
            theme: "Topic 1",
            comments: [
                {
                    name: "Dima",
                    date: '02.04.22',
                    description: "Some text..."
                },
                {
                    name: "Jo",
                    date: '02.04.22',
                    description: "Try again!"
                },
                {
                    name: "Inna",
                    date: '03.04.22',
                    description: "Oh, shit!"
                },
            ]
        },
        {
            name: "Inna",
            date: '04.04.22',
            description: "Cool app!!!",
            theme: "Best app!",
            comments: [
                {
                    name: "Admin",
                    date: '04.04.22',
                    description: "Of course!"
                },
                {
                    name: "Jhon",
                    date: '04.04.22',
                    description: "+"
                },
                {
                    name: "Dino",
                    date: '04.04.22',
                    description: "Yes"
                },
            ]
        },
        {
            name: "Luna",
            date: '06.04.22',
            description: "Learning button does not work",
            theme: "Lol, help me!",
        },
        {
            name: "IvanPro100TopNumberOne",
            date: '09.04.22',
            description: "I'm the best.",
            theme: "IVAN",
            comments: [
                {
                    name: "Pasha",
                    date: '11.04.22',
                    description: "Ahahahaha"
                },
            ]
        },
    ]

    return (
        <Layout>
            <FormLayout>
                <div className={styles.field}>
                    {dataForum.map(item => (
                        <Topic theme={item.theme} date={item.date}  description={item.description} name={item.name}>
                            {(item.comments) ? item.comments.map(comment => (
                                <Comment name={comment.name} date={comment.date} description={comment.description}/>
                            )) : ''}
                        </Topic>
                    ))}
                </div>
            </FormLayout>
        </Layout>
    );
};


Topic.defaultProps = {
    name: "Noname",
    date: '',
    description: "Default description...",
    theme: "Topic"
}

Comment.defaultProps = {
    name: "Noname",
    date: '',
    description: "Default description..."
}