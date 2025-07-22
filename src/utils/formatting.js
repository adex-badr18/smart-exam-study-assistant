// Convert camelCase or PascalCase texts to readable string
export const formatTitle = (str) => {
    return str
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
};