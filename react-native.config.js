module.exports = {
    project: {
        ios: {},
        android: {},
    },
    assets: ['./src/app/static/fonts/'],
    dependencies: {
        'react-native-beacons-manager': {
            platforms: {
                android: null,
                ios: null,
            },
        },
    },
}