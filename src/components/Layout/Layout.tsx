import background from '../../../images/background.png';

export const Layout = ({
    children,
}: JSX.ElementChildrenAttribute): JSX.Element => (
    <div
        className="background"
        style={{
            backgroundImage: `url(${background})`,
        }}
    >
        {children}
    </div>
);
