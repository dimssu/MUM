import './LoadingSpinner.scss';

export default function LoadingSpinner({
    className = '',
    style = {},
    // width = '12px',
    height = '14px',
    color = 'white',
}) {
    return (
        <div id="loading-spinner" className={className} style={style}>
            <div
                className="spin-icon"
                style={{
                    width: height,
                    height: height,
                    borderTopColor: color,
                    borderLeftColor: color,
                }}
            ></div>
        </div>
    );
}
