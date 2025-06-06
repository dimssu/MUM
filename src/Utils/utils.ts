export function isEmpty(value: any) {
    return (
        value === undefined ||
        value === null ||
        // || value === NaN
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0) ||
        (typeof value === 'number' && isNaN(Number(value)))
    );
}