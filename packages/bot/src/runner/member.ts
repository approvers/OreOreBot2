export type MemberEvent = 'JOIN';

export interface MemberEventResponder<M> {
  on(event: MemberEvent, member: M): Promise<void>;
}

export const composeMemberEventResponders = <M>(
  ...responders: readonly MemberEventResponder<M>[]
): MemberEventResponder<M> => ({
  async on(event, member) {
    await Promise.all(
      responders.map((responder) => responder.on(event, member))
    );
  }
});

export class MemberResponseRunner<M> {
  async triggerEvent(event: MemberEvent, member: M): Promise<void> {
    try {
      await Promise.all(this.responder.map((res) => res.on(event, member)));
    } catch (e) {
      console.error(e);
    }
  }

  private responder: MemberEventResponder<M>[] = [];

  addResponder(responder: MemberEventResponder<M>) {
    this.responder.push(responder);
  }
}
