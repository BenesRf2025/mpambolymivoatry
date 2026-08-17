// src/modules/agriculture/ai-advice/ai-advice.service.ts
import { Injectable } from '@nestjs/common';

export interface AdviceInput {
  cropName: string;
  soilHumidity?: number; // %
  temperature?: number; // °C
  daysSincePlanting?: number;
}

export interface AdviceOutput {
  message: string;
  priority: 'INFO' | 'ATTENTION' | 'URGENT';
}

@Injectable()
export class AiAdviceService {
  /**
   * Génère un conseil agronomique simple basé sur des règles métier.
   * Remplace temporairement un vrai appel IA pour la démo hackathon.
   */
  generateAdvice(input: AdviceInput): AdviceOutput {
    const { soilHumidity, temperature, daysSincePlanting, cropName } = input;

    // Règle 1 : Humidité critique
    if (soilHumidity !== undefined) {
      if (soilHumidity < 20) {
        return {
          message: `⚠️ Sol très sec pour ${cropName} (${soilHumidity}%). Irrigation urgente recommandée.`,
          priority: 'URGENT',
        };
      }
      if (soilHumidity < 35) {
        return {
          message: `💧 Humidité du sol faible (${soilHumidity}%). Prévoir un arrosage dans les prochaines 24h.`,
          priority: 'ATTENTION',
        };
      }
      if (soilHumidity > 80) {
        return {
          message: `⚠️ Sol trop humide (${soilHumidity}%). Risque de pourriture des racines, suspendre l'irrigation.`,
          priority: 'ATTENTION',
        };
      }
    }

    // Règle 2 : Température extrême
    if (temperature !== undefined) {
      if (temperature > 35) {
        return {
          message: `🌡️ Température élevée (${temperature}°C). Arroser tôt le matin ou en soirée pour limiter l'évaporation.`,
          priority: 'ATTENTION',
        };
      }
      if (temperature < 10) {
        return {
          message: `❄️ Température basse (${temperature}°C). Risque de ralentissement de croissance pour ${cropName}.`,
          priority: 'ATTENTION',
        };
      }
    }

    // Règle 3 : Approche de la récolte
    if (daysSincePlanting !== undefined && daysSincePlanting > 80) {
      return {
        message: `🌾 ${cropName} plantée depuis ${daysSincePlanting} jours. Vérifiez la maturité pour planifier la récolte.`,
        priority: 'INFO',
      };
    }

    // Cas par défaut
    return {
      message: `✅ Conditions normales pour ${cropName}. Continuez le suivi régulier.`,
      priority: 'INFO',
    };
  }
}
