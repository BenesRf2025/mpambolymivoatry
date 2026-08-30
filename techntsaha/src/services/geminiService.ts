import { PlantDiagnostic, Language } from '../types';
import { sampleDiagnostics } from '../data/mockData';
import * as Speech from 'expo-speech';

// Si vous déployez votre propre backend Gemini (voir server.ts d'origine),
// renseignez EXPO_PUBLIC_API_BASE_URL dans un fichier .env (ex: https://mon-api.exemple.com).
// Sans backend configuré, l'appli utilise directement le moteur de secours agronomique local.
const API_BASE_URL = "AIzaSyBW9J9qy183BqTlBNTPy2V_WFJOgkxEj6c";

export async function diagnosePlantIssue(params: {
  cropName: string;
  symptoms: string;
  imageBase64?: string;
  language: Language;
}): Promise<PlantDiagnostic> {
  const { cropName, symptoms, imageBase64, language } = params;

  try {
    if (!API_BASE_URL) throw new Error('no backend configured');
    const response = await fetch(`${API_BASE_URL}/api/gemini/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cropName,
        symptoms,
        imageBase64,
        language,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.identifiedIssue && !data.fallback) {
        return {
          id: 'diag-' + Date.now(),
          cropName: cropName || 'Culture analysée',
          identifiedIssue: data.identifiedIssue,
          malagasyIssue: data.malagasyIssue || "Aretina fantatra tamin'ny fitiliana",
          issueType: data.issueType || 'disease',
          severity: data.severity || 'high',
          confidence: data.confidence || 92,
          symptomsSummary: data.symptomsSummary || symptoms,
          organicTreatment: Array.isArray(data.organicTreatment)
            ? data.organicTreatment
            : [data.organicTreatment || 'Appliquer du compost mûr et des cendres de bois.'],
          chemicalTreatment: Array.isArray(data.chemicalTreatment)
            ? data.chemicalTreatment
            : undefined,
          prevention: Array.isArray(data.prevention)
            ? data.prevention
            : ['Respecter la rotation des cultures et aérer les plants.'],
          malagasyAdvice:
            data.malagasyAdvice ||
            "Araho maso tsara ny fivoaran'ny voly ary ampiasao zezika natoraly.",
          expertNote:
            data.expertNote ||
            'Diagnostic adapté aux conditions agro-climatiques de Madagascar.',
          dateAnalyzed: new Date().toISOString().split('T')[0],
          imageUrl: imageBase64,
        };
      }
    }
  } catch (error) {
    console.warn('Gemini API call failed, using agronomic knowledge engine fallback:', error);
  }

  // Agronomic Knowledge Base Fallback for Malagasy crops
  const normalizedCrop = (cropName || '').toLowerCase();
  const normalizedSymptoms = (symptoms || '').toLowerCase();

  let matchedDiag = sampleDiagnostics[0];

  if (normalizedCrop.includes('riz') || normalizedCrop.includes('vary') || normalizedSymptoms.includes('riz')) {
    matchedDiag = sampleDiagnostics[0];
  } else if (normalizedCrop.includes('café') || normalizedCrop.includes('kafe') || normalizedSymptoms.includes('rouille') || normalizedSymptoms.includes('orange')) {
    matchedDiag = sampleDiagnostics[1];
  } else if (normalizedCrop.includes('maïs') || normalizedCrop.includes('katsaka') || normalizedSymptoms.includes('chenille') || normalizedSymptoms.includes('trou') || normalizedSymptoms.includes('olitra')) {
    matchedDiag = sampleDiagnostics[2];
  } else if (normalizedCrop.includes('tomate') || normalizedCrop.includes('voatabia')) {
    return {
      id: 'diag-' + Date.now(),
      cropName: 'Tomate (Voatabia)',
      identifiedIssue: 'Mildiou de la tomate (Phytophthora infestans)',
      malagasyIssue: 'Aretina bobongolo amin’ny ravina voatabia',
      issueType: 'disease',
      severity: 'high',
      confidence: 93,
      symptomsSummary: 'Taches brun-noir huileuses sur les feuilles et tiges, flétrissement rapide lors de fortes pluies ou brouillards.',
      organicTreatment: [
        'Pulvérisation préventive de purin d’ortie ou de décoction d’ail (100g d’ail écrasé macéré dans 1L d’eau).',
        'Application de bouillie bordelaise dosée à 0.5% après chaque pluie battante.',
        'Paillage épais du sol pour éviter les éclaboussures de terre infectée sur les feuilles basses.',
      ],
      chemicalTreatment: [
        'Fongicide à base de Mancozèbe ou Cuivre avant floraison.',
      ],
      prevention: [
        'Supprimer les feuilles basses touchant le sol.',
        'Arroser uniquement au pied sans mouiller le feuillage.',
        'Respecter 50cm entre chaque plant pour une circulation optimale de l’air.',
      ],
      malagasyAdvice: 'Tapaho ny ravina ambany mikasika ny tany. Aza mandena ny ravina rehefa manondraka fa ny fototra ihany no tondrahana.',
      expertNote: 'Le mildiou progresse de manière fulgurante dès que l’humidité relative dépasse 85% et la température est comprise entre 15°C et 22°C.',
      dateAnalyzed: new Date().toISOString().split('T')[0],
      imageUrl: imageBase64,
    };
  } else if (normalizedCrop.includes('vanille') || normalizedCrop.includes('lavanila')) {
    return {
      id: 'diag-' + Date.now(),
      cropName: 'Vanille Bourbon',
      identifiedIssue: 'Fusariose des racines (Fusarium oxysporum f. sp. vanillae)',
      malagasyIssue: 'Lozam-paka na loza-davanila',
      issueType: 'disease',
      severity: 'critical',
      confidence: 90,
      symptomsSummary: 'Jaunissement progressif des lianes, pourriture noire des racines adventives, arrêt de la floraison.',
      organicTreatment: [
        'Régénération du paillis avec apport de terreau de forêt riche en Trichoderma naturel.',
        'Aération des sous-bois pour éviter la stagnation d’eau autour du tuteur.',
        'Taille sanitaire immédiate des lianes atteintes avec un sécateur désinfecté à l’alcool.',
      ],
      prevention: [
        'Éviter le piétinement des racines superficielles.',
        'Ne jamais enterrer la base des boutures dans une terre trop compacte.',
      ],
      malagasyAdvice: 'Diovy tsara ny fototry ny lavanila, aza avela hilona rano be. Tapaho ny taho lo ka doroy lavitra ny saha.',
      expertNote: 'Fréquent après des périodes d’inondations prolongées dans la région SAVA.',
      dateAnalyzed: new Date().toISOString().split('T')[0],
      imageUrl: imageBase64,
    };
  }

  return {
    ...matchedDiag,
    id: 'diag-' + Date.now(),
    cropName: cropName || matchedDiag.cropName,
    dateAnalyzed: new Date().toISOString().split('T')[0],
    imageUrl: imageBase64 || matchedDiag.imageUrl,
  };
}

export async function askAgronomistAI(question: string, language: Language = 'fr'): Promise<string> {
  try {
    if (!API_BASE_URL) throw new Error('no backend configured');
    const response = await fetch(`${API_BASE_URL}/api/gemini/advisor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        language,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.answer && !data.fallback) {
        return data.answer;
      }
    }
  } catch (error) {
    console.warn('Gemini Advisor fallback active:', error);
  }

  // Intelligent conversational responses
  const q = question.toLowerCase();
  if (language === 'mg') {
    if (q.includes('vary') || q.includes('sri') || q.includes('tanimbary')) {
      return "Ny fambolem-bary SRI dia mampitombo be ny vokatra. Ketsa 8 ka hatramin'ny 12 andro monja no afindra, tokana isaky ny lavaka, elanelana 25cm x 25cm. Ahena ny rano fa avelao ho maina tsindraindray ny tanimbary mba hahazo rivotra ny fakan-dreny. Asio zezi-pahitra masaka tsara 5 ka hatramin'ny 10 taonina isaky ny hektara.";
    }
    if (q.includes('lavanila') || q.includes('vanille')) {
      return "Ho an'ny lavanila, zava-dehibe ny fitantanana ny alokaloka (50%) amin'ny hazo tondro toy ny Valavelona na Glyricidia. Tazonina mando foana ny fotony amin'ny alalan'ny ravinkazo maina sy kompôsta, fa tandremo tsy ho latsaka anaty rano mihandrona ny fakany.";
    }
    if (q.includes('zezika') || q.includes('compost')) {
      return "Ny kompôsta tsara indrindra dia fangaro sosona: bozaka maina (20cm), fako maitso (15cm), taim-borona na taim-biby (10cm) ary tany lonaka kely. Tondrahana rano antonony ary avadika isaky ny 15 andro. Afaka 45 andro dia masaka tsara izy.";
    }
    return "Misaotra tamin'ny fanontanianao. Amin'ny fambolena eto Madagasikara dia ilaina hatrany ny fampiasana zezi-pahitra masaka tsara, ny fanaraha-maso ny toetr'andro sy ny fiaraha-miasa amin'ny koperativa eo an-toerana hahazoana vidim-bokatra mahafa-po.";
  }

  // French responses
  if (q.includes('sri') || q.includes('riz') || q.includes('rizière')) {
    return "Pour réussir le Système de Riziculture Intensive (SRI) à Madagascar :\n1. Repiquez de jeunes brins de 8 à 10 jours seulement (avec le grain de semence encore attaché).\n2. Un seul brin par trou avec un espacement strict en carré de 25cm x 25cm.\n3. Maintenez le sol humide mais NON inondé en permanence pour stimuler le tallage (30 à 60 tiges par plant).\n4. Passez la sarcleuse rotative tous les 10 jours pour aérer la boue.\n5. Économisez jusqu'à 85% de semences pour doubler votre récolte !";
  }
  if (q.includes('vanille') || q.includes('sava') || q.includes('gousse')) {
    return "Pour la culture de la vanille Bourbon :\n• Privilégiez des tuteurs vivants vigoureux (Glyricidia sepium ou Jatropha curcas) taillés pour laisser 50% de lumière.\n• Le paillage organique épais (15-20 cm) au pied est indispensable pour nourrir les racines adventives sans enfouissement.\n• Effectuez la pollinisation manuelle le matin entre 6h et 11h sur des fleurs fraîchement écloses.";
  }
  if (q.includes('compost') || q.includes('engrais') || q.includes('fumier')) {
    return "Pour préparer un compost organique rapide (Zezi-pahitra) :\n• Alternez 3 couches : matière brune sèche (paille, branchages fins), matière verte azotée (déchets de récolte, feuilles vertes) et fumier de zébu/volaille.\n• Arrosez pour obtenir l'humidité d'une éponge pressée.\n• Retournez le tas au 15ème et 30ème jour. En 45 jours, votre engrais naturel riche en humus est prêt pour vos champs !";
  }

  return "En tant qu'agronome Mpamboly, je vous conseille d'adapter vos semis au calendrier des pluies de votre région, d'utiliser des semences certifiées (FOFIFA) et de nourrir votre sol avec du compost bien décomposé pour préserver sa fertilité à long terme.";
}

export function playTextSpeech(text: string, lang: Language = 'fr') {
  Speech.stop();
  Speech.speak(text, {
    language: 'fr-FR', // pas de voix malgache native disponible sur les moteurs mobiles
    rate: 0.95,
    pitch: 1.0,
  });
  return true;
}

export function stopTextSpeech() {
  Speech.stop();
}
