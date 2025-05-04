import clsx from 'clsx';
import React, { MouseEventHandler } from 'react';
import styles from './Button.module.scss';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface ButtonProps {
    text: string | React.ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
    variant?:
        | 'black'
        | 'white'
        | 'blue'
        | 'blueinverted'
        | 'purple'
        | 'purpleinverted'
        | 'orangeinverted'
        | 'orange'
        | 'orangeInverted'
        | 'primary'
        | 'secondary'
        | 'tertiary';
    size?: 'tiny' | 'small' | 'normal' | 'large' | 'huge' | 'wide';
    style?: React.CSSProperties;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    buttonRef?: any;
    fit?: boolean;
    icon?: any;
    iconSize?: any;
    type?: 'button' | 'submit' | 'reset';
    iconStyles?: React.CSSProperties;
    endIcon?: any;
    endIconSize?: any;
    endIconStyles?: React.CSSProperties;
    endIconClick?: MouseEventHandler<HTMLImageElement>;
}
function Button({
    text = 'Button',
    onClick,
    variant,
    style,
    size = 'normal',
    disabled = false,
    loading = false,
    loadingText = '',
    buttonRef,
    fit = false,
    icon,
    iconSize = '',
    type = 'submit',
    iconStyles,
    endIcon,
    endIconSize = '',
    endIconStyles,
    endIconClick,
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={clsx(styles.Button, {
                [styles.White]: variant === 'white',
                [styles.Blue]: variant === 'blue',
                [styles.BlueInverted]: variant === 'blueinverted',
                [styles.Purple]: variant === 'purple',
                [styles.orange]: variant === 'orange',
                [styles.orangeInverted]: variant === 'orangeInverted',
                [styles.PurpleInverted]: variant === 'purpleinverted',
                [styles.primary]: variant === 'primary',
                [styles.secondary]: variant === 'secondary',
                [styles.tertiary]: variant === 'tertiary',
                [styles.Disabled]: disabled,
                [styles.ClickDisabled]: loading,
                [styles.Fit]: fit,

                [styles.Tiny]: size === 'tiny',
                [styles.Small]: size === 'small',
                [styles.Wide]: size === 'wide',
            })}
            onClick={onClick}
            style={style}
            ref={buttonRef}
            {...props}
        >
            {!!icon &&
                (typeof icon === 'string' ? (
                    <img
                        src={icon}
                        alt="icon"
                        height={iconSize ? iconSize : '1rem'}
                        className={clsx(styles.Icon, { [styles.Hide]: !!loading })}
                        style={iconStyles}
                    />
                ) : (
                    <span style={iconStyles} className={clsx(styles.Icon, { [styles.Hide]: !!loading })}>
                        {icon}
                    </span>
                ))}
            <div className={clsx(styles.Label, { [styles.Hide]: !!loading })}>{text}</div>

            {!!endIcon &&
                (typeof endIcon === 'string' ? (
                    <img
                        src={endIcon}
                        alt="end icon"
                        height={endIconSize ? endIconSize : '1rem'}
                        className={clsx(styles.EndIcon, { [styles.Hide]: !!loading })}
                        style={endIconStyles}
                        onClick={(e) => {
                            if (endIconClick) {
                                e.stopPropagation();
                                endIconClick(e);
                            }
                        }}
                    />
                ) : (
                    <span
                        style={endIconStyles}
                        className={clsx(styles.EndIcon, { [styles.Hide]: !!loading })}
                        onClick={(e) => {
                            if (endIconClick) {
                                e.stopPropagation();
                                endIconClick(e as any);
                            }
                        }}
                    >
                        {endIcon}
                    </span>
                ))}

            {loading && (
                <div className={styles.Loader}>
                    <LoadingSpinner
                        color={
                            variant === 'white' || variant === 'blueinverted' || variant === 'purpleinverted'
                                ? 'var(--primary-text-colour)'
                                : 'white'
                        }
                    />
                </div>
            )}
        </button>
    );
}

export default Button;
