export enum EventHandlerResultType {
  Response = 'response',
  Redirect = 'redirect'
}

interface EventHandlerResponse {
  type: EventHandlerResultType.Response;
  dataType: any;
  data: any;
}

interface EventHandlerRedirect {
  type: EventHandlerResultType.Redirect;
  url: string;
}

export type EventHandlerResponseType = EventHandlerRedirect | EventHandlerResponse;
