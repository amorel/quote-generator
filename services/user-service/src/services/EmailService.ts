import { Quote } from "@quote-generator/shared";

interface EmailOptions {
  to: string;
  quote: Quote;
}

export class EmailService {
  async sendDailyQuote(options: EmailOptions): Promise<void> {
    // Implémentation
    console.log(`Sending daily quote to ${options.to}`);
  }
}
