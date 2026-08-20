// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: ['nativewind/babel'], // <- this is the usual culprit on Expo SDK 53
//   };
// };
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      // 'nativewind/babel' supprimé — inutile et cause l'erreur avec jsxImportSource
      // mets ici tes autres vrais plugins si tu en as, ex: 'react-native-reanimated/plugin' (doit rester en dernier)
    ],
  };
};