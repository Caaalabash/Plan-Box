export const SEQUENCE_DEFAULT = 10
export const SEQUENCE_DIFF = 0.2
export const PERMISSION_MAP = {
  'guest': [],
  'developer': ['guest'],
  'master': ['guest', 'developer'],
  'owner': ['guest', 'developer', 'master']
}