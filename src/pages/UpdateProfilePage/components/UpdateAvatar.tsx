// @ts-nocheck
/* eslint-disable prettier/prettier */
import cn from 'classnames';
import { Button } from 'src/components/Button';
import { ModalWindow } from 'src/components/ModalWindow';
import { ChangeEvent, useContext, useRef, useState } from 'react';
import { useHttp } from 'src/hooks/http.hook';
import { PageLinks } from 'src/components/utils/Routes/types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { AuthContext } from 'src/components/utils/Context/AuthContext';
import {
    File, FileInput, Props, Url,
} from './types';
import styles from './UpdateAvatar.scss';
import { config } from './config';

export const UpdateAvatar: Props = ({ close }): JSX.Element => {
    const dataStore = useSelector(
        (state: AllStateTypes) => state.language.translate,
    );
    const fileInput = useRef<FileInput>(null);
    const [file, setFile] = useState<File>();
    const [preview, setPreview] = useState<Url>('');
    const [defAvatar, setDefAvatar] = useState<Url>('');
    const { token } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const navigate = useNavigate();
    const updateAvatar = async () => {
        try {
            const formData = new FormData();
            formData.append('avatar', file ?? '');
            await request(
                '/api/upload/avatar',
                'POST',
                formData,
                {
                    Authorization: `Bearer ${token}`,
                    'Content-Disposition': 'form-data',

                },
            );
            close();
            navigate(PageLinks.profile);
        } catch (e) {
            throw new Error('Что-то пошло не так');
        }
    };
    const handlerImageCustom = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        const url = URL.createObjectURL(e.target.files[0]);
        setPreview(url);
        setDefAvatar('');
        setFile(e.target.files[0]);
    };

    const handlerImageDefault = async (url: string) => {
        const image = await fetch(url);
        const blob = await image.blob();
        setDefAvatar(url);
        setPreview('');
        setFile(blob);
    };

    return (
        <ModalWindow>
            <div className={styles['update-avatar__block-close']}>
                <Button onClick={close} skin="quad" color="red" title="X" />
            </div>
            <div className={styles['update-avatar__main']}>
                <div>
                    <span className={styles['update-avatar__title']}>
                        {dataStore.labels.default}
                    </span>
                    <div className={styles['update-avatar__block']}>
                        {config.map((element) => (
                            <img
                                key={element.src}
                                aria-hidden
                                style={{
                                    borderColor:
                                        defAvatar === element.src
                                            ? '#febc29'
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
                        {dataStore.labels.custom}
                    </span>
                    <div className={cn(styles['update-avatar__block'], styles['update-avatar__block-custom'])}>
                        {preview ? (
                            <img
                                aria-hidden
                                onClick={() => fileInput.current && fileInput.current.click()}
                                className={
                                    styles['update-avatar__select-custom']
                                }
                                src={preview}
                                alt="AVATAR"
                            />
                        ) : (
                            <div
                                aria-hidden
                                onClick={() => fileInput.current && fileInput.current.click()}
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
                title={dataStore.buttons.confirm}
                skin="wide"
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
