# Mpamboly Mivoatry — Application Mobile (Expo / React Native)

Portage complet de l'application web **mpamboly---application-agricole** vers une
vraie application mobile React Native, avec Expo (Managed Workflow).

## Ce qui a été fait

- **Projet Expo TypeScript** complet, prêt à lancer avec `npx expo start`.
- **Tous les écrans convertis** (19 composants + App.tsx) : Login, Accueil,
  Marché, Diagnostic IA, Guides, Gestion financière, Irrigation intelligente
  (IoT), Inspection de terrain, Boutique vendeur, Espace acheteur,
  Association/Coopérative, et toutes les modales (nouvelle culture, annonce,
  transaction, calculateurs SRI/compost, détail culture).
- **Styling** : [NativeWind](https://www.nativewind.dev/) (Tailwind pour React
  Native) — la quasi-totalité des classes Tailwind d'origine ont été
  conservées telles quelles.
- **Icônes** : `lucide-react-native`, avec un wrapper (`src/lib/icons.tsx`)
  qui permet de garder le même usage `className="w-4 h-4 text-[...]"` que sur
  le web.
- **Persistance locale** : `@react-native-async-storage/async-storage`
  remplace `localStorage` (chargement asynchrone au démarrage de l'app).
- **`<select>` HTML** : remplacé par un composant maison
  (`src/components/ui/SelectField.tsx`) qui ouvre une feuille modale en bas
  d'écran — pattern standard sur mobile.
- **Synthèse vocale** : `expo-speech` remplace la Web Speech API.
- **Photo (diagnostic IA)** : `expo-image-picker` (caméra + galerie), avec
  demande de permission.
- **Dégradés** (bannières colorées) : `expo-linear-gradient` là où c'était
  pertinent ; ailleurs, simplifiés en couleur unie (les dégradés CSS ne sont
  pas nativement supportés par React Native).
- La barre de navigation basse (`NavigationBottom`) et l'écran de connexion
  (`LoginScreen`) sont fidèles à l'original.
- Le "cadre de téléphone" simulé de la version web (utile uniquement pour un
  aperçu dans un navigateur desktop) a été supprimé : l'app tourne nativement
  en plein écran, comme une vraie app installée.

## Démarrer le projet

```bash
npm install
npx expo start
```

Puis scannez le QR code avec l'app **Expo Go** (Android/iOS), ou lancez :

```bash
npx expo start --android   # émulateur/appareil Android
npx expo start --ios       # simulateur iOS (Mac uniquement)
npx expo start --web       # aperçu navigateur
```

## Diagnostic IA (Gemini)

Le service `src/services/geminiService.ts` conserve la même logique de
secours (moteur agronomique local) que l'original. Si vous déployez le
backend Gemini d'origine (`server.ts` du projet source), renseignez son URL
dans un fichier `.env` :

```
EXPO_PUBLIC_API_BASE_URL=https://votre-backend.example.com
```

Sans backend configuré, l'app utilise directement le moteur de secours local
(diagnostics agronomiques pré-calculés) — comme le fait déjà la version web
en cas d'échec réseau.

## Points d'attention avant mise en production

- **Icônes/splash** : `assets/icon.png`, `assets/adaptive-icon.png` et
  `assets/splash.png` sont des placeholders unis (vert Mpamboly). À
  remplacer par vos propres visuels.
- **Détection réseau réelle** (`OfflineIndicator`) : simule actuellement
  l'état en ligne/hors-ligne pour la démo, comme le faisait l'app web sans
  serveur. Pour une vraie détection, ajoutez
  `@react-native-community/netinfo`.
- **Notes vocales** (Inspection de terrain) : simulées (pas d'enregistrement
  audio réel), fidèle au comportement de démo de l'app d'origine. Pour un
  enregistrement réel, utilisez `expo-av`.
- Testez sur un vrai appareil avant publication (Expo Go, puis
  `eas build` pour un binaire signé).
