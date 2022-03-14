export type RoleEvent = 'CREATE';

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

export class RoleResponseRunner<R> {
  async triggerEvent(event: RoleEvent, role: R): Promise<void> {
    await Promise.all(this.responder.map((res) => res.on(event, role)));
  }

  private responder: RoleEventResponder<R>[] = [];

  addResponder(responder: RoleEventResponder<R>) {
    this.responder.push(responder);
  }
}
