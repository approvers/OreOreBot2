export type RoleEvent = 'CREATE' | 'DELETE' | 'UPDATE';

export interface RoleEventResponder<R> {
  on(event: RoleEvent, role: R): Promise<void>;
}

export const composeRoleEventResponders = <R>(
  ...responders: readonly RoleEventResponder<R>[]
): RoleEventResponder<R> => ({
  async on(event, role) {
    await Promise.all(responders.map((responder) => responder.on(event, role)));
  }
});

/**
 * イベントハンドラの登録手段の提供
 */
export interface RoleEventProvider<R> {
  onRoleCreate(hander: (role: R) => Promise<void>): void;
  onRoleDelete(hander: (role: R) => Promise<void>): void;
}

export class RoleResponseRunner<R> {
  constructor(provider: RoleEventProvider<R>) {
    provider.onRoleCreate((role) => this.triggerEvent('CREATE', role));
    provider.onRoleDelete((role) => this.triggerEvent('DELETE', role));
  }

  private async triggerEvent(event: RoleEvent, role: R): Promise<void> {
    await Promise.all(this.responder.map((res) => res.on(event, role)));
  }

  private responder: RoleEventResponder<R>[] = [];

  addResponder(responder: RoleEventResponder<R>) {
    this.responder.push(responder);
  }
}

export interface RoleUpdateEventResponder<R> {
  on(event: 'UPDATE', before: R, after: R): Promise<void>;
}

export const composeRoleUpdateEventResponders = <R>(
  ...responders: readonly RoleUpdateEventResponder<R>[]
): RoleUpdateEventResponder<R> => ({
  async on(event, before, after) {
    await Promise.all(
      responders.map((responder) => responder.on(event, before, after))
    );
  }
});

export interface RoleUpdateEventProvider<R> {
  onRoleUpdate(handler: (before: R, after: R) => Promise<void>): void;
}

export class RoleUpdateResponseRunner<R> {
  constructor(provider: RoleUpdateEventProvider<R>) {
    provider.onRoleUpdate((...args) => this.triggerEvent(args));
  }

  private async triggerEvent([before, after]: [R, R]): Promise<void> {
    await Promise.all(
      this.responders.map((res) => res.on('UPDATE', before, after))
    );
  }

  private responders: RoleUpdateEventResponder<R>[] = [];

  addResponder(responder: RoleUpdateEventResponder<R>) {
    this.responders.push(responder);
  }
}
