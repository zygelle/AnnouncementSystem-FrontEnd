module.exports = {
    transform: {
        '^.+\\.(tsx?|jsx?)$': 'babel-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
};


