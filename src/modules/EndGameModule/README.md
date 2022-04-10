Как использовать модуль:

```javascript
export const Page = (): JSX.Element => {

    const [defeat, setDefeat] = useState(false);
    const [victory, setVictory] = useState(false);

    const defeatFunc = () => {
        setDefeat(!defeat);
    }
    const victoryFunc = () => {
        setVictory(!victory);
    }

    return (
        <div>
            {defeat ? <EndGameModule screen='defeat' callback={defeatFunc} /> : ''}
            {victory ? <EndGameModule screen='victory' callback={victoryFunc} /> : ''}

            // any code...

            <Button title="def" onClick={defeatFunc} />
            <Button title="win" onClick={victoryFunc} /> 
        </div>
    );
};
```