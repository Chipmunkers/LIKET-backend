/**
 * 서버 유형입니다.
 *
 * @author jochongs
 */
export const SERVER_TYPE = {
  BATCH_SERVER: 'batch-server',
  ADMIN_SERVER: 'admin-server',
  USER_SERVER: 'user-server',
} as const;

export type ServerType = (typeof SERVER_TYPE)[keyof typeof SERVER_TYPE];
