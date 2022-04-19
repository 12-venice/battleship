import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from 'src/hooks/http.hook';
import { PageLinks } from 'src/components/utils/Routes/types';
import { Props } from './types';
import styles from './UpdateAvatar.scss';
import image1 from '../../../../images/avatars/m.png';
import image2 from '../../../../images/avatars/ma.png';
import image3 from '../../../../images/avatars/w.png';
import image4 from '../../../../images/avatars/wa.png';

export const UpdateAvatar: Props = ({ close }): JSX.Element => {
    const fileInput = useRef(null);
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const { request, loading } = useHttp();
    const updateAvatar = async () => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            await request(
                '/user/profile/avatar',
                'PUT',
                null,
                {},
                false,
                formData,
            );
        } catch (e) {
            throw new SyntaxError('Что-то пошло не так');
        }
    };
    const handlerImageCustom = (e: { target: { files: Blob[] } }) => {
        const img = URL.createObjectURL(e.target?.files[0]);
        setPreview(img);
        setFile(e.target.files[0]);
    };

    const handlerImageDefault = async (image: URL) => {
        const img = await fetch(image);
        const blob = await img.blob();
        setPreview(image);
        setFile(blob);
    };

    const config = [
        {
            src: image1,
            alt: 'Avatar#1',
        },
        {
            src: image2,
            alt: 'Avatar#2',
        },
        {
            src: image3,
            alt: 'Avatar#3',
        },
        {
            src: image4,
            alt: 'Avatar#4',
        },
    ];

    return (
        <ModalWindow>
            <div className={styles['update-avatar__block-close']}>
                <Button onClick={close} skin="quad" color="red" title="X" />
            </div>
            <div className={styles['update-avatar__main']}>
                <div>
                    <span className={styles['update-avatar__title']}>
                        DEFAULT
                    </span>
                    <div className={styles['update-avatar__block']}>
                        {config.map((element) => (
                            <img
                                key={uuidv4()}
                                aria-hidden
                                style={{
                                    borderColor:
                                        preview === element.src
                                            ? '#09469a'
                                            : '#ffffff',
                                }}
                                className={
                                    styles['update-avatar__select-default']
                                }
                                src={element.src}
                                alt={element.alt}
                                onClick={() => handlerImageDefault(element.src)}
                            />
                        ))}
                    </div>
                </div>
                <span className={styles['update-avatar__title']}>or</span>
                <div>
                    <span className={styles['update-avatar__title']}>
                        CUSTOM
                    </span>
                    <div className={styles['update-avatar__block']}>
                        {preview ? (
                            <img
                                aria-hidden
                                onClick={() => fileInput.current.click()}
                                className={
                                    styles['update-avatar__select-custom']
                                }
                                src={preview}
                                alt="AVATAR"
                            />
                        ) : (
                            <div
                                aria-hidden
                                onClick={() => fileInput.current.click()}
                                className={
                                    styles['update-avatar__select-custom']
                                }
                            >
                                <span>input a custom</span>
                                <span>file from your</span>
                                <span>computer</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Button
                title="CONFIRM"
                skin="regular"
                onClick={updateAvatar}
                disabled={!file || loading}
            />
            <input
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={(e) => handlerImageCustom(e)}
                type="file"
                ref={fileInput}
            />
        </ModalWindow>
    );
};
