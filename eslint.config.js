// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // `Alert` de react-native n'existe pas sur react-native-web : la popup
      // disparaît sans erreur. useAlert() a la même API et affiche la même
      // modale maison sur natif comme sur web.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Alert'],
              message:
                "Alert est un no-op sur le web : utiliser showAlert() de useAlert() ('@/src/contexts/AlertContext').",
            },
          ],
        },
      ],
    },
  },
]);
