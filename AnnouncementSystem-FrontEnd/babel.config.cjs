module.exports = {
    presets: [
        '@babel/preset-env',
        [
            '@babel/preset-react',
            {
                runtime: 'automatic', // Adicione isso aqui
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        // Plugins, se necessário
    ],
};

