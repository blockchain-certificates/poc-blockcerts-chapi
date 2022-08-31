export enum EventHandlerResultType {
  Response = 'response',
  Redirect = 'redirect'
}

interface EventHandlerResponse {
  type: EventHandlerResultType.Response;
  dataType: string;
  data: string;
}

interface EventHandlerRedirect {
  type: EventHandlerResultType.Redirect;
  url: string;
}

export type EventHandlerResponseType = EventHandlerRedirect | EventHandlerResponse;
