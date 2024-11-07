// Types d'authentification
export type {
    LoginCredentials,
    RegisterCredentials,
    LoginResponse,
    JWTPayload,
    User,
} from './types/auth';

// Types d'événements
export {
    EventTypes,
} from './types/events';

export type {
    EventMetadata,
    EventMessage,
    UserEventData,
} from './types/events';

// Types de citations
export type {
    QuoteDTO,
    CreateQuoteDTO,
    UpdateQuoteDTO,
    Quote,
} from './types/quote';

// Types utilisateur
export type {
    UserProfile,
} from './types/user';

// Constants de messagerie
export {
    QUEUES,
    EXCHANGES,
    ROUTING_KEYS,
} from './constants/messaging';

// Types de messagerie RabbitMQ
export type {
    RabbitMQConfig,
    RabbitMQMessage,
    PublishOptions,
    SubscribeOptions,
} from './messaging/types';

// Classe de base RabbitMQ
export {
    RabbitMQBase
} from './messaging/RabbitMQBase';

export * from './messaging/types';