import { EventTypes } from "@quote-generator/shared";

export class QuoteEventListener {
  async handleEvent(type: EventTypes, data: any) {
    switch (type) {
      case EventTypes.USER_UPDATED:
        // Logique de mise à jour
        break;
      // ... autres cas
    }
  }
}
