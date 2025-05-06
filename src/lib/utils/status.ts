export type Status = 'NEW' | 'IN_PROGRESS' | 'WAITING_INFO' | 'DONE';

const nextState: Record<Status, Status> = {
  NEW:          'IN_PROGRESS',
  IN_PROGRESS:  'WAITING_INFO',
  WAITING_INFO: 'DONE',
  DONE:         'DONE'
};

export function advance(status: Status) {
  return nextState[status];
}