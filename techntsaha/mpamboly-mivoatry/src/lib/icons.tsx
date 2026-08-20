// Ce fichier permet d'utiliser les icônes lucide-react-native avec `className`
// (couleurs / tailles Tailwind) exactement comme lucide-react sur le web,
// grâce à cssInterop de NativeWind. Tous les composants importent leurs
// icônes depuis ce fichier plutôt que directement depuis 'lucide-react-native'.
import { cssInterop } from 'nativewind';
import * as LucideIcons from 'lucide-react-native';

Object.keys(LucideIcons).forEach((key) => {
  const IconComponent = (LucideIcons as any)[key];
  if (
    IconComponent &&
    (typeof IconComponent === 'function' || typeof IconComponent === 'object')
  ) {
    try {
      cssInterop(IconComponent, {
        className: {
          target: 'style',
          nativeStyleToProp: { height: true, width: true, color: true },
        },
      });
    } catch (e) {
      // certains exports (types, createLucideIcon...) ne sont pas des composants
    }
  }
});

export * from 'lucide-react-native';
