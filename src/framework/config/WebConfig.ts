export const webConfig = {
    server: {
        data: {
            url: import.meta.env.VITE_SERVER_DATA_URL
        }
    }
};

console.log(`config: ${JSON.stringify(webConfig)}`);