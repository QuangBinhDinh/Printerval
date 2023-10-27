const removeBracket = (str: string) => {
    if (!str) return null;
    return str
        .replace(/\([^)]*\)/, '')
        .replace(/\[[^\]]*\]/, '')
        .trim();
};

export { removeBracket };
